import axios from "axios";

const BASE_URL = "http://34.200.125.158:8002";

// Create instance
const AxiosInstance = axios.create({
  baseURL: BASE_URL, // replace with your actual base URL
});

// Request Interceptor
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken") || "";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default AxiosInstance;
