import api from "./axiosInstance";

export const authApi = {
  login: (email, password) => api.post("/api/auth/login", { email, password }),
  getMe: () => api.get("/api/auth/me"),
  register: (data) => api.post("/api/auth/register", data),
  getUsers: () => api.get("/api/auth/users"),
  toggleUser: (id) => api.patch(`/api/auth/users/${id}/toggle`),
};
