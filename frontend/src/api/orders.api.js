import api from "./axiosInstance";

export const ordersApi = {
  getAll: () => api.get("/api/orders"),
  getById: (id) => api.get(`/api/orders/${id}`),
  create: (data) => api.post("/api/orders", data),
  changeStatus: (id, newStatus, note) =>
    api.patch(`/api/orders/${id}/status`, { newStatus, note }),
  addItem: (id, item) => api.post(`/api/orders/${id}/items`, item),
  getHistory: (id) => api.get(`/api/orders/${id}/history`),
};
