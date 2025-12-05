import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  // Determine if this is an admin-related request
  const isAdminRequest = config.url?.startsWith('/admin') || config.url?.startsWith('/auth/admin');

  // Select the appropriate token
  let token;
  if (isAdminRequest) {
    token = localStorage.getItem("adminToken");
  } else {
    token = localStorage.getItem("token") || localStorage.getItem("studentToken");
  }

  // Fallback: if specific token not found, try generic 'token' (unless we already tried it)
  if (!token && isAdminRequest) {
    token = localStorage.getItem("token");
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 if we're not already on a public route
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isPublicRoute = currentPath === '/' ||
        currentPath.includes('/login') ||
        currentPath.includes('/signup');

      if (!isPublicRoute) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('studentToken');
        // Redirect to appropriate login page based on current route
        if (currentPath.includes('/admin')) {
          window.location.href = '/admin/login';
        } else {
          window.location.href = '/student/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
