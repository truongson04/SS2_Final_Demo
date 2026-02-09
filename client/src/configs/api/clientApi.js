import axios from "axios";

const clientApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});
clientApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
export default clientApi;
