import axios from "axios";
import { appConfig } from "../config/environment";

console.log("JWT Token:", import.meta.env.VITE_JWT_TOKEN)
console.log("Username:", import.meta.env.VITE_USERNAME)

const api = axios.create({
  baseURL: appConfig.apiUrl,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_JWT_TOKEN}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Prefer': 'return=representation'  // PostgREST header for returning data
  },
});

// Request interceptor to automatically include username in POST/PATCH requests
api.interceptors.request.use(
  (config) => {
    const username = import.meta.env.VITE_USERNAME;
    
    // Add username to request body for POST and PATCH requests
    if (config.method === 'post' || config.method === 'patch') {
      if (config.data && username) {
        config.data = {
          ...config.data,
          username: username
        };
      }
    }
    
    console.log(`🌐 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log('📦 Request payload:', config.data);
    console.log('📋 Request headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export default api;
