import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;


// ===============================
// PATIENT CRUD
// ===============================

export const getPatient = (id) =>
  api.get(`/patients/${id}`);

export const updatePatient = (id, data) =>
  api.put(`/patients/${id}`, data);

export const deletePatient = (id) =>
  api.delete(`/patients/${id}`);

export const searchPatients = (query) =>
  api.get(`/patients/search/?query=${query}`);

export const getAnalyticsSummary = () =>
  api.get("/analytics/summary");