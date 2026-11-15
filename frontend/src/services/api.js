import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

// ========================================
// AUTH
// ========================================

export const loginUser = (data) =>
  api.post("/auth/login", data);

export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email });

export const verifyOTP = (email, otp) =>
  api.post("/auth/verify-otp", {
    email,
    otp,
  });

export const resetPassword = (
  email,
  otp,
  new_password,
  confirm_password
) =>
  api.post("/auth/reset-password", {
    email,
    otp,
    new_password,
    confirm_password,
  });

export const resendOTP = (email) =>
  api.post("/auth/resend-otp", { email });

// ========================================
// PATIENT CRUD
// ========================================

export const getPatient = (id) =>
  api.get(`/patients/${id}`);

export const updatePatient = (id, data) =>
  api.put(`/patients/${id}`, data);

export const deletePatient = (id) =>
  api.delete(`/patients/${id}`);

export const searchPatients = (query) =>
  api.get(`/patients/search?query=${query}`);

// ========================================
// ANALYTICS
// ========================================

export const getAnalyticsSummary = () =>
  api.get("/analytics/summary");