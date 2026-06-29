import axios from "axios";

// Create instance
const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL, // replace with your actual base URL
});

// Request Interceptor
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token") || "";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url ?? "";
      const isLoginRequest = requestUrl.includes("/login");

      if (!isLoginRequest) {
        localStorage.clear();
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
