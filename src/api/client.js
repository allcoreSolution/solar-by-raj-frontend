

const PROD_API = "https://solar-by-raj-backend-2.onrender.com/api";

const resolveApiBase = () => {
  const env = String(import.meta.env.VITE_API_URL || "").trim().replace(/\/+$/, "");

  // Use env only if it is a full http(s) URL. Always make sure it ends with /api.
  if (/^https?:\/\//i.test(env)) {
    return /\/api$/i.test(env) ? env : `${env}/api`;
  }

  // Wrong/missing env in production -> use the live backend.
  return import.meta.env.PROD ? PROD_API : "/api";
};

const API_BASE = resolveApiBase();


// ============================================================
// REQUEST FUNCTION
// ============================================================

const request = async (url, options = {}) => {
  let response;

  // ----------------------------------------------------------
  // Headers
  // ----------------------------------------------------------

  const headers = {
    ...(options.headers || {}),
  };

  // ----------------------------------------------------------
  // Admin JWT Token
  // ----------------------------------------------------------

  const token = localStorage.getItem("solarpro_admin_token");

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // ----------------------------------------------------------
  // JSON Content-Type
  // ----------------------------------------------------------

  if (
    options.body &&
    !headers["Content-Type"] &&
    !headers["content-type"]
  ) {
    headers["Content-Type"] = "application/json";
  }

  // ----------------------------------------------------------
  // Fetch Request
  // ----------------------------------------------------------

  try {
    response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers,
    });
  } catch (error) {
    console.error("SolarPro API Network Error:", error);

    throw new Error(
      "Cannot connect to the SolarPro API server. Please check the backend server."
    );
  }

  // ----------------------------------------------------------
  // Read Response
  // ----------------------------------------------------------

  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch (error) {
    data = {
      message: text || "Invalid server response",
    };
  }

  // ----------------------------------------------------------
  // Authentication Error
  // ----------------------------------------------------------

  if (response.status === 401) {
    // Remove expired/invalid token
    localStorage.removeItem("solarpro_admin_token");

    // Do not automatically redirect here.
    // Your React login/authentication system can handle it.
    throw new Error(
      data?.message || "Authentication required."
    );
  }

  // ----------------------------------------------------------
  // Forbidden
  // ----------------------------------------------------------

  if (response.status === 403) {
    throw new Error(
      data?.message || "You do not have permission to perform this action."
    );
  }

  // ----------------------------------------------------------
  // Not Found
  // ----------------------------------------------------------

  if (response.status === 404) {
    throw new Error(
      data?.message || "Requested API endpoint was not found."
    );
  }

  // ----------------------------------------------------------
  // Server Error
  // ----------------------------------------------------------

  if (response.status >= 500) {
    throw new Error(
      data?.message ||
        "Server error. Please try again later."
    );
  }

  // ----------------------------------------------------------
  // Other HTTP Errors
  // ----------------------------------------------------------

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Request failed (${response.status})`
    );
  }

  // ----------------------------------------------------------
  // Successful Response
  // ----------------------------------------------------------

  if (data === null && options.method && options.method !== "GET") {
    throw new Error(
      `Server did not respond correctly (HTTP ${response.status}) at ${API_BASE}${url}`
    );
  }

  return data;
};


// ============================================================
// GET
// ============================================================

export const api = {
  get: (url) => {
    return request(url, {
      method: "GET",
    });
  },


  // ==========================================================
  // POST
  // ==========================================================

  post: (url, body = {}) => {
    return request(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },


  // ==========================================================
  // PATCH
  // ==========================================================

  patch: (url, body = {}) => {
    return request(url, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },


  // ==========================================================
  // DELETE
  // ==========================================================

  delete: (url) => {
    return request(url, {
      method: "DELETE",
    });
  },

  // Alias: AdminDashboard.jsx uses api.del(...)
  del: (url) => {
    return request(url, {
      method: "DELETE",
    });
  },
};


// ============================================================
// EXPORT DEFAULT
// ============================================================

export default api;