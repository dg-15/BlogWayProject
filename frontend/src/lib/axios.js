import axios from "axios";

// Set to 5002 (or whichever port your task app's backend is using)
const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5002/api"
    : `${import.meta.env.VITE_API_URL}/api`;

const api = axios.create({
  baseURL: BASE_URL,
  // withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }

  // if (config.data instanceof FormData) {
  //   delete config.headers["Content-Type"]; // Let Axios handle it automatically
  // }

  return config;
});

export default api;
