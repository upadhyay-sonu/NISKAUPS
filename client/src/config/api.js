import axios from "axios";

// Force production backend URL
const API_BASE_URL = "https://niskaups.onrender.com/api";

console.log("API Base URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add JWT token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle CORS errors
    if (!error.response) {
      if (error.message === 'Network Error') {
        console.error('CORS Error: Check if backend is running and accessible');
        console.error('Backend URL:', API_BASE_URL);
      }
    }
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.log("Unauthorized → user not logged in");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    
    // Handle 403 Forbidden (CORS blocked)
    if (error.response?.status === 403) {
      console.error('CORS Error: Backend blocked this request');
    }
    
    return Promise.reject(error);
  }
);

export default api;