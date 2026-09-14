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
  document.body.style.background = "linear-gradient(135deg, #1B0E23, #7A326B)";
  bubblesBG();
});

instructorBtn.addEventListener("click", () => {
  instructorForm.classList.add("active");
  studentForm.classList.remove("active");
  registerForm.classList.remove("active");
  instructorBtn.classList.add("active");
  studentBtn.classList.remove("active");
  document.body.style.background = "linear-gradient(135deg, #12514F, #1C7C79)";
  linesBG();
});

function showRegister() {
  studentForm.classList.remove("active");
  instructorForm.classList.remove("active");
  registerForm.classList.add("active");
  studentBtn.classList.remove("active");
  instructorBtn.classList.remove("active");
  document.body.style.background = "linear-gradient(135deg, #B8940A, #E9BF16)";
  particlesBG();
}

function showLogin() {
  registerForm.classList.remove("active");
  studentForm.classList.add("active");
  studentBtn.classList.add("active");
  document.body.style.background = "linear-gradient(135deg, #1B0E23, #7A326B)";
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

/* =====================================================
   Backend integration (uses window.SattvaAPI from api.js)
===================================================== */
const formMessage = document.getElementById("formMessage");

function showMessage(text, type) {
  formMessage.textContent = text;
  formMessage.hidden = false;
  formMessage.classList.remove("is-error", "is-success");
  if (type) formMessage.classList.add(type);
}

function hideMessage() {
  formMessage.hidden = true;
}

function setSubmitting(form, isSubmitting, busyLabel) {
  const btn = form.querySelector("button.submit");
  if (!btn) return;
  if (isSubmitting) {
    btn.dataset.originalLabel = btn.dataset.originalLabel || btn.textContent;
    btn.textContent = busyLabel || "Please wait…";
    btn.disabled = true;
  } else {
    btn.textContent = btn.dataset.originalLabel || btn.textContent;
    btn.disabled = false;
  }
}

// If already logged in, skip straight to the dashboard.
(function redirectIfLoggedIn() {
  if (window.SattvaAPI && window.SattvaAPI.isLoggedIn()) {
    const user = window.SattvaAPI.getUser();
    if (user && user.role) {
      window.location.href = window.SattvaAPI.dashboardUrlForRole(user.role);
    }
  }
})();

// ---- Student login ----
studentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideMessage();

  const email = document.getElementById("studentLoginEmail").value.trim();
  const password = document.getElementById("studentLoginPassword").value;

  setSubmitting(studentForm, true, "Logging in…");
  try {
    const res = await SattvaAPI.login({ email, password });
    SattvaAPI.setSession(res.data.token, res.data.user);
    showMessage("Login successful! Redirecting…", "is-success");
    window.location.href = SattvaAPI.dashboardUrlForRole(res.data.user.role);
  } catch (err) {
    showMessage(err.message, "is-error");
  } finally {
    setSubmitting(studentForm, false);
  }
});

// ---- Instructor login (same backend, role: teacher) ----
instructorForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideMessage();

  const email = document.getElementById("instructorLoginEmail").value.trim();
  const password = document.getElementById("instructorLoginPassword").value;

  setSubmitting(instructorForm, true, "Logging in…");
  try {
    const res = await SattvaAPI.login({ email, password });
    if (res.data.user.role !== "teacher" && res.data.user.role !== "admin") {
      showMessage("This account isn't registered as an instructor.", "is-error");
      return;
    }
    SattvaAPI.setSession(res.data.token, res.data.user);
    showMessage("Login successful! Redirecting…", "is-success");
    window.location.href = SattvaAPI.dashboardUrlForRole(res.data.user.role);
  } catch (err) {
    showMessage(err.message, "is-error");
  } finally {
    setSubmitting(instructorForm, false);
  }
});

// ---- Registration ----
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideMessage();

  const full_name = document.getElementById("regFullName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const phone = document.getElementById("regPhone").value.trim();
  const password = document.getElementById("regPassword").value;
  const selectedRole = roleSelect.value; // "student" | "instructor"

  if (!selectedRole) {
    showMessage("Please select a role.", "is-error");
    return;
  }

  // Backend roles are "student" | "teacher" | "admin"
  const role = selectedRole === "instructor" ? "teacher" : "student";

  setSubmitting(registerForm, true, "Creating account…");
  try {
    const res = await SattvaAPI.register({ full_name, email, phone, password, role });
    SattvaAPI.setSession(res.data.token, res.data.user);
    showMessage("Account created! Redirecting…", "is-success");
    window.location.href = SattvaAPI.dashboardUrlForRole(res.data.user.role);
  } catch (err) {
    showMessage(err.message, "is-error");
  } finally {
    setSubmitting(registerForm, false);
  }
});
