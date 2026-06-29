const studentBtn = document.getElementById("studentBtn");
const instructorBtn = document.getElementById("instructorBtn");
const studentForm = document.getElementById("studentForm");
const instructorForm = document.getElementById("instructorForm");
const registerForm = document.getElementById("registerForm");
const roleSelect = document.getElementById("roleSelect");
const studentFields = document.getElementById("studentFields");
const instructorFields = document.getElementById("instructorFields");
const bg = document.getElementById("bg");

function clearBG() {
  bg.innerHTML = "";
}

function bubblesBG() {
  clearBG();
  for (let i = 0; i < 15; i++) {
    let bubble = document.createElement("div");
    bubble.classList.add("bubble");
    let size = Math.random() * 60 + 20;
    bubble.style.width = size + "px";
    bubble.style.height = size + "px";
    bubble.style.left = Math.random() * 100 + "vw";
    bubble.style.animationDuration = Math.random() * 5 + 5 + "s";
    bg.appendChild(bubble);
  }
}

function linesBG() {
  clearBG();
  for (let i = 0; i < 20; i++) {
    let line = document.createElement("div");
    line.classList.add("line");
    line.style.left = Math.random() * 100 + "vw";
    line.style.animationDuration = Math.random() * 3 + 3 + "s";
    bg.appendChild(line);
  }
}

function particlesBG() {
  clearBG();
  for (let i = 0; i < 30; i++) {
    let particle = document.createElement("div");
    particle.classList.add("particle");
    particle.style.left = Math.random() * 100 + "vw";
    particle.style.top = Math.random() * 100 + "vh";
    particle.style.animationDuration = Math.random() * 2 + 2 + "s";
    bg.appendChild(particle);
  }
}

studentBtn.addEventListener("click", () => {
  studentForm.classList.add("active");
  instructorForm.classList.remove("active");
  registerForm.classList.remove("active");
  studentBtn.classList.add("active");
  instructorBtn.classList.remove("active");
  document.body.style.background = "linear-gradient(135deg, #4a148c, #880e4f)";
  bubblesBG();
});

instructorBtn.addEventListener("click", () => {
  instructorForm.classList.add("active");
  studentForm.classList.remove("active");
  registerForm.classList.remove("active");
  instructorBtn.classList.add("active");
  studentBtn.classList.remove("active");
  document.body.style.background = "linear-gradient(135deg, #283593, #1565c0)";
  linesBG();
});

function showRegister() {
  studentForm.classList.remove("active");
  instructorForm.classList.remove("active");
  registerForm.classList.add("active");
  studentBtn.classList.remove("active");
  instructorBtn.classList.remove("active");
  document.body.style.background = "linear-gradient(135deg, #00695c, #43a047)";
  particlesBG();
}

function showLogin() {
  registerForm.classList.remove("active");
  studentForm.classList.add("active");
  studentBtn.classList.add("active");
  document.body.style.background = "linear-gradient(135deg, #4a148c, #880e4f)";
  bubblesBG();
}

function toggleRegistrationFields() {
  if (roleSelect.value === "student") {
    studentFields.style.display = "block";
    instructorFields.style.display = "none";
  } else if (roleSelect.value === "instructor") {
    instructorFields.style.display = "block";
    studentFields.style.display = "none";
  } else {
    studentFields.style.display = "none";
    instructorFields.style.display = "none";
  }
}

// Default background (Student bubbles)
bubblesBG();
