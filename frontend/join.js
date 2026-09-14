// join.js — Join page interactions

function toggleMenu() {
  document.getElementById("navbar").classList.toggle("show");
}

const siteHeader = document.getElementById("siteHeader");
if (siteHeader) {
  window.addEventListener("scroll", () => {
    siteHeader.classList.toggle("scrolled", window.scrollY > 40);
  });
}

function showForm(type, btn) {
  document.getElementById("student-form").classList.remove("active");
  document.getElementById("instructor-form").classList.remove("active");
  document.getElementById(`${type}-form`).classList.add("active");

  document.getElementById("studentBtn").classList.remove("active");
  document.getElementById("instructorBtn").classList.remove("active");
  if (btn) btn.classList.add("active");
}
