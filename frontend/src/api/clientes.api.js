import api from "./axiosInstance";

export const clientesApi = {
  getAll: () => api.get("/clientes"),
  getById: (id) => api.get(`/clientes/${id}`),
  create: (data) => api.post("/clientes", data),
  update: (id, data) => api.put(`/clientes/${id}`, data),
  remove: (id) => api.delete(`/clientes/${id}`),
};
