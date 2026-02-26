import api from "./axiosInstance";

export const estadosApi = {
  getAll: () => api.get("/api/estados"),
  getByName: (name) => api.get(`/api/estados/${name}`),
};
