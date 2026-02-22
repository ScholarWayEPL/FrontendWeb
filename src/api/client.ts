import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach auth token if available
client.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor: handle 401 globally
client.interceptors.response.use((response) => response, (error) => {
  if (error?.response?.status === 401) {
    // Optionally: emit an event, clear storage, redirect to login
    try { localStorage.removeItem('authToken'); } catch (e) {}
    // window.location.href = '/login'; // don't force navigation in library code
  }
  return Promise.reject(error);
});

export default client;
