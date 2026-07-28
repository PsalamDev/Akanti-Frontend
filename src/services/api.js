import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Request Interceptor: Attach bearer token if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle errors and expired sessions gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // 1. Detailed error logs to pin down the exact route causing problems
    console.error(
      `❌ [API Error] Method: ${originalRequest?.method?.toUpperCase()} | URL: ${originalRequest?.url} | Status: ${error.response?.status}`
    );

    if (error.response?.status === 401) {
      // 2. Identify if the failing request is part of the auth flow
      const isLoginRequest = originalRequest?.url?.includes('/auth/login');
      const isRegisterRequest = originalRequest?.url?.includes('/auth/register');
      const isMeRequest = originalRequest?.url?.includes('/auth/me');
      const isAlreadyAtLogin = window.location.pathname === '/login';

      // 3. Only wipe storage and redirect if the failure is NOT from login/register screens
      if (!isLoginRequest && !isRegisterRequest && !isAlreadyAtLogin) {
        console.warn("⚠️ [API Interceptor] 401 Unauthorized detected on resource request. Clearing session.");
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Only redirect using window.location if your React Router isn't catching it
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  verifyResetCode: (data) => api.post('/auth/verify-reset-code', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  verifyEmail: (data) => api.post('/auth/verify-email', data),
  resendCode: (data) => api.post('/auth/resend-code', data),
  changePassword: (data) => api.post('/auth/change-password', data),
};

export const incomeAPI = {
  getAll: (params) => api.get('/income', { params }),
  getById: (id) => api.get(`/income/${id}`),
  create: (data) => api.post('/income', data),
  update: (id, data) => api.put(`/income/${id}`, data),
  delete: (id) => api.delete(`/income/${id}`),
  getTotal: (params) => api.get('/income/total', { params }),
};

export const expenseAPI = {
  getAll: (params) => api.get('/expense', { params }),
  getById: (id) => api.get(`/expense/${id}`),
  create: (data) => api.post('/expense', data),
  update: (id, data) => api.put(`/expense/${id}`, data),
  delete: (id) => api.delete(`/expense/${id}`),
  getTotal: (params) => api.get('/expense/total', { params }),
};

export const budgetAPI = {
  getAll: () => api.get('/budget'),
  getById: (id) => api.get(`/budget/${id}`),
  create: (data) => api.post('/budget', data),
  update: (id, data) => api.put(`/budget/${id}`, data),
  delete: (id) => api.delete(`/budget/${id}`),
  getAlerts: () => api.get('/budget/alerts'),
};

export const debtAPI = {
  getAll: (params) => api.get('/debt', { params }),
  getById: (id) => api.get(`/debt/${id}`),
  create: (data) => api.post('/debt', data),
  update: (id, data) => api.put(`/debt/${id}`, data),
  delete: (id) => api.delete(`/debt/${id}`),
  recordPayment: (id, data) => api.post(`/debt/${id}/payment`, data),
  getUpcoming: (params) => api.get('/debt/upcoming', { params }),
  sendReminder: (id) => api.post(`/debt/${id}/remind`),
};

export const dashboardAPI = {
  get: () => api.get('/dashboard'),
};

export const cashFlowAPI = {
  get: (params) => api.get('/cashflow', { params }),
  getMonthly: (params) => api.get('/cashflow/monthly', { params }),
};

export const reportAPI = {
  get: (params) => api.get('/report', { params }),
  getProfitLoss: (params) => api.get('/report/profit-loss', { params }),
};

export const notificationAPI = {
  getAll: (params) => api.get('/notification', { params }),
  markAsRead: (id) => api.put(`/notification/${id}/read`),
  markAllAsRead: () => api.put('/notification/read-all'),
  getUnreadCount: () => api.get('/notification/unread-count'),
};

export const categoryAPI = {
  getAll: (params) => api.get('/category', { params }),
};

export const aiAPI = {
  getHealthScore: () => api.get('/aiassistant/health-score'),
  getSpendingAnalysis: (params) => api.get('/aiassistant/spending-analysis', { params }),
  getBudgetRecommendation: (id) => api.get(`/aiassistant/budget-recommendation/${id}`),
  getSavingsSuggestions: () => api.get('/aiassistant/savings-suggestions'),
  getExpensePrediction: () => api.get('/aiassistant/expense-prediction'),
  chat: (data) => api.post('/aiassistant/chat', data),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserDetail: (id) => api.get(`/admin/users/${id}`),
  toggleActive: (id) => api.put(`/admin/users/${id}/toggle-active`),
  getAuditLogs: (params) => api.get('/admin/audit-logs', { params }),
};

export default api;