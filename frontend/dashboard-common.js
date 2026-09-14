/* =====================================================
   dashboard-common.js
   Shared by student-dashboard.html, teacher-dashboard.html
   and admin-dashboard.html:
     - Guards the page (redirects to login2.html if not logged in)
     - Renders the header's user chip
     - Wires the logout button
     - Small helpers used by the page-specific scripts
===================================================== */

function requireRole(allowedRoles) {
  if (!window.SattvaAPI || !SattvaAPI.isLoggedIn()) {
    window.location.href = "login2.html";
    return null;
  }

  const user = SattvaAPI.getUser();

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    // Logged in, but wrong dashboard for this role — send them to the right one.
    window.location.href = user ? SattvaAPI.dashboardUrlForRole(user.role) : "login2.html";
    return null;
  }

  renderUserChip(user);
  wireLogout();

  return user;
}

function renderUserChip(user) {
  const nameEl = document.getElementById("chipName");
  const roleEl = document.getElementById("chipRole");
  if (nameEl) nameEl.textContent = user.full_name;
  if (roleEl) roleEl.textContent = user.role;
}

function wireLogout() {
  const btn = document.getElementById("logoutBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    SattvaAPI.logout();
    window.location.href = "login2.html";
  });
}

function showError(container, message) {
  container.innerHTML = `<div class="dash-error">${escapeHtml(message)}</div>`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
