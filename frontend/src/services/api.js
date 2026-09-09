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