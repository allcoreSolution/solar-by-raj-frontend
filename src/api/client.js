// const API_BASE = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL)
//   ? String(import.meta.env.VITE_API_URL).replace(/\/$/, "")
//   : "/api";

// const request = async (url, options = {}) => {
//   let res;
//   const headers = { ...(options.headers || {}) };
//   const token = localStorage.getItem("solarpro_admin_token");
//   if (token) headers.Authorization = `Bearer ${token}`;
//   if (options.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";

//   try {
//     res = await fetch(API_BASE + url, { ...options, headers });
//   } catch {
//     throw new Error("Network error. Is the API running?");
//   }

//   let data = null;
//   const text = await res.text();
//   try {
//     data = text ? JSON.parse(text) : null;
//   } catch {
//     data = { message: text || "Invalid server response" };
//   }

//   if (!res.ok) {
//     const msg = data?.message || data?.error || `Request failed (${res.status})`;
//     throw new Error(msg);
//   }
//   return data;
// };

// export const api = {
//   get: (url) => request(url),
//   post: (url, body) => request(url, { method: "POST", body: JSON.stringify(body || {}) }),
//   patch: (url, body) => request(url, { method: "PATCH", body: JSON.stringify(body || {}) }),
//   delete: (url) => request(url, { method: "DELETE" }),
// };

// export default api;



// ============================================================
// SolarPro API Client
// Supports:
// 1. Local development
// 2. Render production
// 3. Admin JWT authentication
// 4. GET / POST / PATCH / DELETE
// ============================================================

// ------------------------------------------------------------
// API BASE URL
// ------------------------------------------------------------
// Local:
// VITE_API_URL=http://localhost:5000/api
//
// Production:
// VITE_API_URL=https://your-backend.onrender.com/api
//
// If VITE_API_URL is not provided, "/api" is used.
// This allows Vite's local proxy to work.
// ------------------------------------------------------------

const API_BASE = String(
  import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD
      ? "https://solar-by-raj-backend-2.onrender.com/api"
      : "/api")
).replace(/\/+$/, "");


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
    throw new Error("Server did not respond correctly. Check the API URL.");
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
};


// ============================================================
// EXPORT DEFAULT
// ============================================================

export default api;