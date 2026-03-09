import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log("API Base URL:", API_BASE_URL);

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15000,
});

api.interceptors.request.use(
    (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
    },
);

api.interceptors.response.use(
    (response) => {
        console.log(
            `API Response: ${response.status} ${response.config.url}`,
            response.data,
        );
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        console.error(
            "API Error:",
            error.response?.status,
            error.response?.data || error.message,
        );
        return Promise.reject(error);
    },
);

export default api;
