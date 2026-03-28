import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

// Auth
export const trackActivity = () => api.patch('/auth/activity');
export const setBusyMode   = (busyMode) => api.patch('/auth/busy-mode', { busyMode });

// Insights
export const getInsights = () => api.get('/insights');

// Customer health
export const getCustomerHealth = (id) => api.get(`/customers/${id}/health`);

// Customers
export const getCustomers   = () => api.get('/customers');
export const createCustomer = (data) => api.post('/customers', data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);

// Invoices
export const getInvoices        = () => api.get('/invoices');
export const createInvoice      = (data) => api.post('/invoices', data);
export const updateInvoiceStatus = (id, status) => api.patch(`/invoices/${id}/status`, { status });
export const deleteInvoice      = (id) => api.delete(`/invoices/${id}`);

// Notifications
export const getNotifications     = () => api.get('/notifications');
export const getUnreadCount       = () => api.get('/notifications/unread-count');
export const markNotificationRead = (id) => api.patch(`/notifications/${id}/read`);
export const markAllRead          = () => api.patch('/notifications/read-all');

export default api;
