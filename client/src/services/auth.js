import axios from 'axios';

const API = `${
  import.meta.env.VITE_API_URL || 'https://smart-invoicing-assistant.onrender.com'
}/api/auth`;

export const registerUser = (data) => axios.post(`${API}/register`, data);
export const loginUser = (data) => axios.post(`${API}/login`, data);
