import axios from 'axios';
import { serverUrl } from '../constants/config';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: serverUrl,
  withCredentials: true,
});

// Add request interceptor to include token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 404) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      // window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
