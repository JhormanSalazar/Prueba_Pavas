import api from "./axiosInstance";

export const motosApi = {
  getAll: () => api.get("/motos"),
  getById: (id) => api.get(`/motos/${id}`),
  search: (query) => api.get(`/motos/search?q=${encodeURIComponent(query)}`),
  create: (data) => api.post("/motos", data),
  update: (id, data) => api.put(`/motos/${id}`, data),
  remove: (id) => api.delete(`/motos/${id}`),
};
