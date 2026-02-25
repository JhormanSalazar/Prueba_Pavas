import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

export const ordersApi = {
  getAll: () => api.get("/orders"),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post("/orders", data),
  changeStatus: (id, newStatus) =>
    api.patch(`/orders/${id}/status`, { newStatus }),
  addItem: (id, item) => api.post(`/orders/${id}/items`, item),
};
