import api from "./axiosInstance";

export const ordersApi = {
  getAll: () => api.get("/orders"),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post("/orders", data),
  changeStatus: (id, newStatus, note) =>
    api.patch(`/orders/${id}/status`, { newStatus, note }),
  addItem: (id, item) => api.post(`/orders/${id}/items`, item),
  getHistory: (id) => api.get(`/orders/${id}/history`),
};
