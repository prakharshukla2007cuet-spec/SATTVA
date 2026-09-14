/* =====================================================
   api.js — SATTVA shared API client
   -----------------------------------------------------
   Loaded on every page (via <script src="api.js">) BEFORE
   the page's own script. Exposes a single global,
   `SattvaAPI`, used by login2.js (and any future page)
   to talk to the Flask backend.

   👉 DEPLOYMENT: set the production backend URL below.
   Everything else (token storage, headers, error handling)
   just works once that's set correctly.
===================================================== */
(function (global) {
  "use strict";

  /* -----------------------------------------------------
     1. Figure out the backend base URL.
     - Local dev (opening the site on localhost/127.0.0.1):
       talk to a locally running Flask server on port 5000.
     - Production: replace PRODUCTION_API_URL below with your
       deployed backend's URL (e.g. from Render/Railway),
       including the "/api" suffix.
  ----------------------------------------------------- */
  const PRODUCTION_API_URL = "https://REPLACE_WITH_YOUR_BACKEND_URL/api";

  const { hostname } = window.location;
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "";

  const API_BASE_URL = isLocal
    ? "http://127.0.0.1:5000/api"
    : PRODUCTION_API_URL;

  /* -----------------------------------------------------
     2. Session storage helpers (JWT + user object)
  ----------------------------------------------------- */
  const TOKEN_KEY = "sattva_token";
  const USER_KEY = "sattva_user";

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY));
    } catch (e) {
      return null;
    }
  }

  function setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  function setSession(token, user) {
    setToken(token);
    setUser(user);
  }

  function isLoggedIn() {
    return !!getToken();
  }

  /* -----------------------------------------------------
     3. Core request helper
  ----------------------------------------------------- */
  async function request(path, { method = "GET", body, auth = false, isForm = false } = {}) {
    const headers = {};

    if (!isForm) {
      headers["Content-Type"] = "application/json";
    }

    if (auth) {
      const token = getToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    let res;
    try {
      res = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers,
        body: isForm ? body : body ? JSON.stringify(body) : undefined
      });
    } catch (networkErr) {
      throw new Error(
        "Could not reach the SATTVA server. Please check your connection and try again."
      );
    }

    let data = null;
    try {
      data = await res.json();
    } catch (e) {
      /* non-JSON response, ignore */
    }

    if (!res.ok) {
      const message = (data && data.message) || `Request failed (${res.status})`;
      const err = new Error(message);
      err.status = res.status;
      throw err;
    }

    return data;
  }

  /* -----------------------------------------------------
     4. Public API
  ----------------------------------------------------- */
  const SattvaAPI = {
    baseUrl: API_BASE_URL,

    // ---- Auth ----
    register(payload) {
      return request("/auth/register", { method: "POST", body: payload });
    },
    login(payload) {
      return request("/auth/login", { method: "POST", body: payload });
    },
    me() {
      return request("/auth/me", { auth: true });
    },
    logout() {
      clearSession();
    },

    // ---- Session helpers ----
    isLoggedIn,
    getUser,
    setSession,
    clearSession,

    // ---- Student ----
    studentDashboard() {
      return request("/student/dashboard", { auth: true });
    },
    studentProfile() {
      return request("/student/profile", { auth: true });
    },
    updateStudentProfile(payload) {
      return request("/student/profile", { method: "PATCH", body: payload, auth: true });
    },

    // ---- Teacher ----
    teacherDashboard() {
      return request("/teacher/dashboard", { auth: true });
    },
    teacherProfile() {
      return request("/teacher/profile", { auth: true });
    },
    updateTeacherProfile(payload) {
      return request("/teacher/profile", { method: "PATCH", body: payload, auth: true });
    },

    // ---- Admin ----
    adminDashboard() {
      return request("/admin/dashboard", { auth: true });
    },
    adminUsers(role) {
      return request(`/admin/users${role ? `?role=${encodeURIComponent(role)}` : ""}`, { auth: true });
    },
    updateUserRole(userId, role) {
      return request(`/admin/users/${userId}/role`, { method: "PATCH", body: { role }, auth: true });
    },
    updateUserStatus(userId, isActive) {
      return request(`/admin/users/${userId}/status`, {
        method: "PATCH",
        body: { is_active: isActive },
        auth: true
      });
    },
    deleteUser(userId) {
      return request(`/admin/users/${userId}`, { method: "DELETE", auth: true });
    },

    // ---- Gallery ----
    galleryList() {
      return request("/gallery/");
    },
    galleryUpload(formData) {
      return request("/gallery/upload", { method: "POST", body: formData, auth: true, isForm: true });
    },
    galleryDelete(imageId) {
      return request(`/gallery/${imageId}`, { method: "DELETE", auth: true });
    },
    galleryFileUrl(filename) {
      // Strip the trailing "/api" since uploads are served from the same host.
      return `${API_BASE_URL.replace(/\/api$/, "")}/api/gallery/uploads/${filename}`;
    },

    // ---- Redirect helper: send a logged-in user to the right dashboard ----
    dashboardUrlForRole(role) {
      if (role === "admin") return "admin-dashboard.html";
      if (role === "teacher") return "teacher-dashboard.html";
      return "student-dashboard.html";
    }
  };

  global.SattvaAPI = SattvaAPI;
})(window);
