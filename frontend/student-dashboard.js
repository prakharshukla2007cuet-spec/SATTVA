document.addEventListener("DOMContentLoaded", async () => {
  const user = requireRole(["student"]);
  if (!user) return;

  document.getElementById("welcomeName").textContent = `, ${user.full_name.split(" ")[0]}`;

  const content = document.getElementById("dashContent");

  try {
    const profileRes = await SattvaAPI.studentProfile();
    const profile = profileRes.data;

    content.innerHTML = `
      <div class="dash-card">
        <h2>Your Profile</h2>
        <div class="profile-grid">
          <div><div class="field-label">Full Name</div><div class="field-value">${escapeHtml(profile.full_name)}</div></div>
          <div><div class="field-label">Email</div><div class="field-value">${escapeHtml(profile.email)}</div></div>
          <div><div class="field-label">Phone</div><div class="field-value">${escapeHtml(profile.phone || "—")}</div></div>
          <div><div class="field-label">Account Status</div><div class="field-value">${profile.is_active ? "Active" : "Inactive"}</div></div>
        </div>
      </div>

      <div class="dash-card">
        <h2>Update Your Details</h2>
        <form class="edit-form" id="editForm">
          <label>Full Name</label>
          <input type="text" id="editName" value="${escapeHtml(profile.full_name)}">
          <label>Phone</label>
          <input type="tel" id="editPhone" value="${escapeHtml(profile.phone || "")}" placeholder="10-digit mobile number">
          <button type="submit">Save Changes</button>
          <p id="editMsg" class="dash-loading" style="display:none;"></p>
        </form>
      </div>
    `;

    document.getElementById("editForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const msg = document.getElementById("editMsg");
      msg.style.display = "block";
      msg.textContent = "Saving…";
      try {
        const res = await SattvaAPI.updateStudentProfile({
          full_name: document.getElementById("editName").value.trim(),
          phone: document.getElementById("editPhone").value.trim()
        });
        SattvaAPI.setSession(localStorage.getItem("sattva_token"), res.data);
        msg.textContent = "Saved!";
      } catch (err) {
        msg.textContent = err.message;
      }
    });
  } catch (err) {
    showError(content, err.message);
  }
});
