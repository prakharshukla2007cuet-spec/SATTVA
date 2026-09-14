/* =====================================================
   Mobile menu toggle
===================================================== */
function toggleMenu() {
  document.getElementById("navbar").classList.toggle("show");
}

/* =====================================================
   Header: solid background after scrolling past hero
===================================================== */
const siteHeader = document.getElementById("siteHeader");
if (siteHeader) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }
  });
}

/* =====================================================
   UPCOMING EVENTS
   -----------------------------------------------------
   👉 TO ADD OR EDIT AN EVENT: just add/edit an object in
   the EVENTS array below. No other code needs to change.

   Fields:
     day       - number, e.g. 12
     month     - 3-letter month, e.g. "JUL"
     title     - event name
     time      - e.g. "5:00 PM – 7:00 PM"
     location  - venue text
     category  - one of: "dance", "music", "art", "craft",
                 "yoga", "workshop"  (controls the card colour)
     desc      - one short line about the event
     formUrl   - the Google Form link for this event's
                 registration. Clicking the card opens this
                 in a new tab. Create a form at
                 forms.google.com, click Send, copy the
                 short link, and paste it here.
===================================================== */
const EVENTS = [
  {
    day: 12,
    month: "JUL",
    title: "Kathak Open Workshop",
    time: "5:00 PM – 7:00 PM",
    location: "SATTVA Studio, Arya Nagar",
    category: "dance",
    desc: "A free trial session for beginners curious about classical Kathak.",
    formUrl: "https://forms.google.com/REPLACE_WITH_YOUR_FORM_LINK"
  },
  {
    day: 20,
    month: "JUL",
    title: "Watercolour Weekend",
    time: "11:00 AM – 1:00 PM",
    location: "SATTVA Studio, Arya Nagar",
    category: "art",
    desc: "Two-hour hands-on watercolour workshop for all skill levels.",
    formUrl: "https://forms.google.com/REPLACE_WITH_YOUR_FORM_LINK"
  },
  {
    day: 2,
    month: "AUG",
    title: "Monsoon Music Showcase",
    time: "6:00 PM onwards",
    location: "SATTVA Auditorium",
    category: "music",
    desc: "Our vocal & instrumental students perform for family and friends.",
    formUrl: "https://forms.google.com/REPLACE_WITH_YOUR_FORM_LINK"
  }
];

/* Opens an event's Google Form in a new tab */
function openEventForm(url) {
  if (!url) return;
  window.open(url, "_blank", "noopener");
}

/* Renders the EVENTS array into the #eventsTrack container */
function renderEvents() {
  const track = document.getElementById("eventsTrack");
  const empty = document.getElementById("eventsEmpty");
  if (!track) return;

  if (!EVENTS.length) {
    if (empty) empty.hidden = false;
    return;
  }

  track.innerHTML = EVENTS.map((ev, i) => `
    <article class="event-card" data-category="${ev.category}" data-reveal
      role="button" tabindex="0" aria-label="Register for ${ev.title} on Google Forms"
      onclick="openEventForm('${ev.formUrl}')"
      onkeydown="if(event.key==='Enter'){openEventForm('${ev.formUrl}')}">
      <div class="event-date">
        <span class="event-day">${ev.day}</span>
        <span class="event-month">${ev.month}</span>
      </div>
      <div class="event-divider"></div>
      <div class="event-body">
        <span class="event-tag">${ev.category}</span>
        <h3>${ev.title}</h3>
        <p class="event-meta"><i class="fas fa-clock"></i> ${ev.time}</p>
        <p class="event-meta"><i class="fas fa-map-marker-alt"></i> ${ev.location}</p>
        <p class="event-desc">${ev.desc}</p>
        <span class="event-link">Register on Google Form</span>
      </div>
    </article>
  `).join("");

  observeReveals();
}

/* =====================================================
   Scroll-reveal animation (respects reduced motion)
===================================================== */
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
  }, { threshold: 0.15 });

  items.forEach(item => observer.observe(item));
}

document.addEventListener("DOMContentLoaded", () => {
  // Mark section headings/cards for reveal animation
  document.querySelectorAll(
    ".about-container, .offer-card, .gallery-item, .testimonial-card, .cta-container"
  ).forEach(el => el.setAttribute("data-reveal", ""));

  renderEvents();
  observeReveals();
});

/* =====================================================
   Optional service worker (kept from original build)
===================================================== */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .then((reg) => console.log("SW registered:", reg.scope))
      .catch((err) => console.log("SW not registered (optional):", err.message));
  });
}