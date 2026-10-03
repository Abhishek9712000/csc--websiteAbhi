const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

export const api = {
  getConfig: () => fetch(`${API_URL}/api/config`).then(handle),

  getServices: () => fetch(`${API_URL}/api/services`).then(handle),
  getService: (slug) => fetch(`${API_URL}/api/services/${slug}`).then(handle),

  submitApplication: (formData) =>
    fetch(`${API_URL}/api/applications`, { method: "POST", body: formData }).then(handle),

  submitPayment: (applicationId, formData) =>
    fetch(`${API_URL}/api/applications/${applicationId}/payment`, {
      method: "POST",
      body: formData,
    }).then(handle),

  trackApplication: (referenceId) =>
    fetch(`${API_URL}/api/applications/track/${referenceId}`).then(handle),

  // ===== PDF Receipt =====
  getReceiptUrl: (applicationId) =>
    `${API_URL}/api/applications/${applicationId}/receipt`,

  // ===== Razorpay Payment =====
  createPaymentOrder: (applicationId) =>
    fetch(`${API_URL}/api/payment/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId }),
    }).then(handle),

  verifyPayment: (paymentData) =>
    fetch(`${API_URL}/api/payment/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    }).then(handle),

  // ===== Admin =====
  adminLogin: (username, password) =>
    fetch(`${API_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }).then(handle),

  adminChangePassword: (token, currentPassword, newPassword) =>
    fetch(`${API_URL}/api/admin/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    }).then(handle),

  adminGetApplications: (token, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetch(`${API_URL}/api/applications${qs ? `?${qs}` : ""}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(handle);
  },

  adminGetApplication: (token, id) =>
    fetch(`${API_URL}/api/applications/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(handle),

  adminUpdateApplication: (token, id, updates) =>
    fetch(`${API_URL}/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(updates),
    }).then(handle),

  adminFileUrl: (id, filename, token) =>
    `${API_URL}/api/applications/${id}/documents/${filename}`,

  fetchProtectedFile: (token, id, filename) =>
    fetch(`${API_URL}/api/applications/${id}/documents/${filename}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export default API_URL;