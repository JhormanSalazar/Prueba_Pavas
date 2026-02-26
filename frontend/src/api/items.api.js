import api from "./axiosInstance";

export const itemsApi = {
  getAll: () => api.get("/items"),
  getById: (id) => api.get(`/items/${id}`),
  create: (data) => api.post("/items", data),
  update: (id, data) => api.put(`/items/${id}`, data),
  remove: (id) => api.delete(`/items/${id}`),
};
