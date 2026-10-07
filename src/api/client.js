const API_BASE = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL)
  ? String(import.meta.env.VITE_API_URL).replace(/\/$/, "")
  : "/api";

const request = async (url, options = {}) => {
  let res;
  const headers = { ...(options.headers || {}) };
  const token = localStorage.getItem("solarpro_admin_token");
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";

  try {
    res = await fetch(API_BASE + url, { ...options, headers });
  } catch {
    throw new Error("Network error. Is the API running?");
  }

  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text || "Invalid server response" };
  }

  if (!res.ok) {
    const msg = data?.message || data?.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
};

export const api = {
  get: (url) => request(url),
  post: (url, body) => request(url, { method: "POST", body: JSON.stringify(body || {}) }),
  patch: (url, body) => request(url, { method: "PATCH", body: JSON.stringify(body || {}) }),
  delete: (url) => request(url, { method: "DELETE" }),
};

export default api;
