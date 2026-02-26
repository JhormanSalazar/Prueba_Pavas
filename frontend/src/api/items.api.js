import api from "./axiosInstance";

export const itemsApi = {
  getAll: () => api.get("/api/items"),
  getById: (id) => api.get(`/api/items/${id}`),
  create: (data) => api.post("/api/items", data),
  update: (id, data) => api.put(`/api/items/${id}`, data),
  remove: (id) => api.delete(`/api/items/${id}`),
};
