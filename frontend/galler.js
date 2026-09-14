// galler.js — Gallery page: data, rendering, filtering, lightbox

/* =====================================================
   GALLERY DATA
   -----------------------------------------------------
   👉 TO ADD PHOTOS/VIDEOS (e.g. your Instagram bedazzling
   workshop shots): add one object per item to this array.
   No other code needs to change.

   ⚠️ NOTE: categories and captions below are my best-guess
   placeholders (I can't see the actual photo content) —
   please skim through and correct any that are wrong.

   Fields:
     type      - "image" or "video"
     src       - filename, same folder as this page
     category  - "dance" | "art" | "craft" | "music" | "moments"
     caption   - short line shown on hover + in the lightbox
     featured  - true to also show in the "Featured Moments"
                 strip at the top (keep this to 2–4 items)
===================================================== */
const GALLERY_ITEMS = [
  { type: "video", src: "WhatsApp Video 2025-07-17 at 8.22.30 PM.mp4", category: "art", caption: "Sketching, one line at a time" },
  { type: "video", src: "WhatsApp Video 2025-07-19 at 12.26.57 AM.mp4", category: "dance", caption: "Pure dance, pure joy", featured: true },
  { type: "video", src: "WhatsApp Video 2025-07-19 at 12.24.51 AM.mp4", category: "dance", caption: "Ek number" },
  { type: "video", src: "WhatsApp Video 2025-07-17 at 8.23.56 PM.mp4", category: "craft", caption: "Clay, creativity, and a little bit of magic", featured: true },
  { type: "image", src: "WhatsApp Image 2025-07-17 at 8.47.04 PM.jpeg", category: "craft", caption: "Hands at work" },
  { type: "image", src: "WhatsApp Image 2025-07-17 at 8.47.02 PM.jpeg", category: "art", caption: "Painted with pride" },
  { type: "image", src: "WhatsApp Image 2025-07-17 at 8.47.01 PM.jpeg", category: "craft", caption: "Colour and character" },
  { type: "image", src: "WhatsApp Image 2025-07-17 at 8.46.59 PM.jpeg", category: "moments", caption: "SATTVA smiles" },
  { type: "image", src: "WhatsApp Image 2025-07-17 at 8.46.57 PM.jpeg", category: "art", caption: "Focused and creative" },
  { type: "image", src: "WhatsApp Image 2025-07-17 at 8.46.54 PM.jpeg", category: "craft", caption: "Handmade with care" },
  { type: "image", src: "WhatsApp Image 2025-07-17 at 8.46.51 PM.jpeg", category: "moments", caption: "A SATTVA moment" },
  { type: "image", src: "WhatsApp Image 2025-07-17 at 8.46.49 PM.jpeg", category: "art", caption: "Young artist at work" },
  { type: "image", src: "WhatsApp Image 2025-07-17 at 8.46.47 PM.jpeg", category: "craft", caption: "Made by hand" },
  { type: "image", src: "WhatsApp Image 2025-07-17 at 8.46.45 PM.jpeg", category: "moments", caption: "Together at SATTVA" },
  { type: "image", src: "WhatsApp Image 2025-07-17 at 8.46.44 PM.jpeg", category: "art", caption: "Creative concentration" },
  { type: "image", src: "WhatsApp Image 2025-07-17 at 8.46.41 PM.jpeg", category: "craft", caption: "Crafting something new" },
  { type: "image", src: "WhatsApp Image 2025-07-17 at 8.46.38 PM.jpeg", category: "moments", caption: "A SATTVA memory" },
  { type: "image", src: "WhatsApp Image 2025-07-17 at 8.46.36 PM.jpeg", category: "art", caption: "In the flow", featured: true },
  { type: "image", src: "WhatsApp Image 2025-07-17 at 8.46.33 PM.jpeg", category: "craft", caption: "Bringing ideas to life" }

  // Example of how to add the Instagram "bedazzling workshop" photos:
  // { type: "image", src: "bedazzling-1.jpeg", category: "craft", caption: "Bedazzling Workshop" },
];

const PAGE_SIZE = 9;
let currentFilter = "all";
let visibleCount = PAGE_SIZE;
let lightboxIndex = -1; // index within the currently-rendered image list

/* ---------- Mobile menu (shared header) ---------- */
function toggleMenu() {
  document.getElementById("navbar").classList.toggle("show");
}
const siteHeader = document.getElementById("siteHeader");
if (siteHeader) {
  window.addEventListener("scroll", () => {
    siteHeader.classList.toggle("scrolled", window.scrollY > 40);
  });
}

/* ---------- Helpers ---------- */
function filteredItems() {
  return currentFilter === "all"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(i => i.category === currentFilter);
}

function mediaTile(item, idx) {
  const inner = item.type === "video"
    ? `<video src="${item.src}" controls playsinline></video>`
    : `<img src="${item.src}" alt="${item.caption}" data-idx="${idx}">`;

  return `
    <figure class="gallery-item" data-category="${item.category}" data-reveal>
      ${inner}
      <figcaption class="item-caption">${item.caption}</figcaption>
    </figure>
  `;
}

/* ---------- Featured strip (always shows all featured items) ---------- */
function renderFeatured() {
  const strip = document.getElementById("featuredStrip");
  const featured = GALLERY_ITEMS.filter(i => i.featured);
  if (!featured.length) {
    document.querySelector(".featured-section").style.display = "none";
    return;
  }
  strip.innerHTML = featured.map(item => `
    <div class="featured-card">
      <video src="${item.src}" controls playsinline muted></video>
      <p class="featured-caption">${item.caption}</p>
    </div>
  `).join("");
}

/* ---------- Main grid (respects filter + load-more) ---------- */
function renderGrid() {
  const grid = document.getElementById("galleryGrid");
  const empty = document.getElementById("galleryEmpty");
  const loadMoreWrap = document.querySelector(".load-more-wrap");
  const items = filteredItems();

  if (!items.length) {
    grid.innerHTML = "";
    empty.hidden = false;
    loadMoreWrap.style.display = "none";
    return;
  }
  empty.hidden = true;

  const shown = items.slice(0, visibleCount);
  grid.innerHTML = shown.map((item, i) => mediaTile(item, i)).join("");

  loadMoreWrap.style.display = visibleCount < items.length ? "flex" : "none";

  attachImageClicks();
  observeReveals();
}

/* ---------- Filter buttons ---------- */
document.querySelectorAll("#filterButtons button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#filterButtons button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    visibleCount = PAGE_SIZE;
    renderGrid();
  });
});

/* ---------- Load more ---------- */
document.getElementById("loadMoreBtn").addEventListener("click", () => {
  visibleCount += PAGE_SIZE;
  renderGrid();
});

/* ---------- Lightbox (images only, with prev/next) ---------- */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightboxCaption");

function currentImageList() {
  // Only images currently rendered in the grid, in order
  return filteredItems().slice(0, visibleCount).filter(i => i.type === "image");
}

function openLightbox(item) {
  const list = currentImageList();
  lightboxIndex = list.findIndex(i => i.src === item.src);
  showLightboxItem();
  lightbox.style.display = "block";
}

function showLightboxItem() {
  const list = currentImageList();
  if (!list.length) return;
  if (lightboxIndex < 0) lightboxIndex = list.length - 1;
  if (lightboxIndex >= list.length) lightboxIndex = 0;
  const item = list[lightboxIndex];
  lightboxImg.src = item.src;
  lightboxCaption.textContent = item.caption || "";
}

function attachImageClicks() {
  document.querySelectorAll(".gallery-item img").forEach(img => {
    img.addEventListener("click", () => {
      const item = filteredItems().slice(0, visibleCount).find(i => i.src === img.getAttribute("src"));
      if (item) openLightbox(item);
    });
  });
}

document.getElementById("lightboxClose").addEventListener("click", () => {
  lightbox.style.display = "none";
});
document.getElementById("lightboxPrev").addEventListener("click", () => {
  lightboxIndex--; showLightboxItem();
});
document.getElementById("lightboxNext").addEventListener("click", () => {
  lightboxIndex++; showLightboxItem();
});
window.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.style.display = "none";
});
window.addEventListener("keydown", (e) => {
  if (lightbox.style.display !== "block") return;
  if (e.key === "Escape") lightbox.style.display = "none";
  if (e.key === "ArrowLeft") { lightboxIndex--; showLightboxItem(); }
  if (e.key === "ArrowRight") { lightboxIndex++; showLightboxItem(); }
});

/* ---------- Scroll to top ---------- */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- Scroll-reveal animation ---------- */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function observeReveals() {
  if (prefersReducedMotion) return;
  const items = document.querySelectorAll("[data-reveal]:not(.is-visible)");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach(item => observer.observe(item));
}

/* ---------- Backend-uploaded images ---------- */
/* Instructors/admins can upload photos from their dashboard
   (see teacher-dashboard.html). Those are stored on the
   backend, not as static files here, so we fetch and merge
   them into GALLERY_ITEMS before the first render. */
async function loadBackendGalleryItems() {
  if (!window.SattvaAPI) return;
  try {
    const res = await SattvaAPI.galleryList();
    const backendItems = (res.data || []).map(img => ({
      type: "image",
      src: SattvaAPI.galleryFileUrl(img.filename),
      category: "moments",
      caption: img.title || img.description || "SATTVA moment"
    }));
    GALLERY_ITEMS.unshift(...backendItems);
  } catch (err) {
    // Non-fatal: the static gallery still works if the backend is unreachable.
    console.log("Gallery: couldn't load uploaded photos:", err.message);
  }
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", async () => {
  await loadBackendGalleryItems();
  renderFeatured();
  renderGrid();
});