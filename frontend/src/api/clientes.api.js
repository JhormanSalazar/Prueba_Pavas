import api from "./axiosInstance";

export const clientesApi = {
  getAll: () => api.get("/api/clientes"),
  getById: (id) => api.get(`/api/clientes/${id}`),
  create: (data) => api.post("/api/clientes", data),
  update: (id, data) => api.put(`/api/clientes/${id}`, data),
  remove: (id) => api.delete(`/api/clientes/${id}`),
};
