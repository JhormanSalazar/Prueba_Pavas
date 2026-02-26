import api from "./axiosInstance";

export const estadosApi = {
  getAll: () => api.get("/estados"),
  getByName: (name) => api.get(`/estados/${name}`),
};
