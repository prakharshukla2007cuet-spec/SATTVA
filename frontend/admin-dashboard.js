document.addEventListener("DOMContentLoaded", async () => {
  const user = requireRole(["admin"]);
  if (!user) return;

  const statsContent = document.getElementById("statsContent");
  const usersContent = document.getElementById("usersContent");

  try {
    const statsRes = await SattvaAPI.adminDashboard();
    const stats = statsRes.data;

    statsContent.innerHTML = `
      <div class="stat-grid">
        <div class="stat-card"><span class="stat-num">${stats.total_users}</span><span class="stat-label">Total Users</span></div>
        <div class="stat-card"><span class="stat-num">${stats.students}</span><span class="stat-label">Students</span></div>
        <div class="stat-card"><span class="stat-num">${stats.teachers}</span><span class="stat-label">Teachers</span></div>
        <div class="stat-card"><span class="stat-num">${stats.admins}</span><span class="stat-label">Admins</span></div>
      </div>
    `;
  } catch (err) {
    showError(statsContent, err.message);
  }

  try {
    const usersRes = await SattvaAPI.adminUsers();
    const users = usersRes.data;

    if (!users.length) {
      usersContent.innerHTML = `<p class="dash-loading">No users yet.</p>`;
      return;
    }

    usersContent.innerHTML = `
      <table class="data-table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${users.map(u => `
            <tr>
              <td>${escapeHtml(u.full_name)}</td>
              <td>${escapeHtml(u.email)}</td>
              <td><span class="role-tag">${escapeHtml(u.role)}</span></td>
              <td>${u.is_active ? "Active" : "Inactive"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  } catch (err) {
    showError(usersContent, err.message);
  }
});
