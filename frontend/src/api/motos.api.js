import api from "./axiosInstance";

export const motosApi = {
  getAll: () => api.get("/api/motos"),
  getById: (id) => api.get(`/api/motos/${id}`),
  search: (query) => api.get(`/api/motos/search?q=${encodeURIComponent(query)}`),
  create: (data) => api.post("/api/motos", data),
  update: (id, data) => api.put(`/api/motos/${id}`, data),
  remove: (id) => api.delete(`/api/motos/${id}`),
};
