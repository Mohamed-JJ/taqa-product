import axios from "axios";
import { toast } from "sonner";

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token and log requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log API requests
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      url: config.url,
      method: config.method,
      params: config.params,
      data: config.data,
      headers: config.headers,
    });
    
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor to handle auth errors and log responses
apiClient.interceptors.response.use(
  (response) => {
    // Log successful API responses
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  (error) => {
    // Comprehensive error logging
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code,
      stack: error.stack,
    };

    console.error(`❌ API Error: ${errorDetails.method} ${errorDetails.url}`, errorDetails);

    if (error.response?.status === 401) {
      // Token expired or invalid
      console.warn("🔒 Authentication failed - redirecting to login");
      localStorage.removeItem("access_token");
      localStorage.removeItem("uid");
      localStorage.removeItem("userName");

      // Redirect to login
      window.location.href = "/auth";

      toast.error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      console.warn("🚫 Access forbidden");
      toast.error(
        "Access denied. You do not have permission to perform this action.",
      );
    } else if (error.response?.status >= 500) {
      console.error("🔥 Server error detected");
      toast.error("Server error. Please try again later.");
    } else if (error.code === "ECONNABORTED") {
      console.error("⏰ Request timeout");
      toast.error("Request timeout. Please check your connection.");
    } else if (!error.response) {
      console.error("🌐 Network error - no response received");
      toast.error("Network error. Please check your connection.");
    } else {
      // Log any other errors
      console.error("🐛 Unhandled API error:", error);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
