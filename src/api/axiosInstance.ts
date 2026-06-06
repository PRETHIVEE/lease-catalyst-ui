import axios from "axios";

// Create instance
const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL, // replace with your actual base URL
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
  (error) => Promise.reject(error),
);

export default AxiosInstance;
