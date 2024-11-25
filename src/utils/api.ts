import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add a request interceptor
api.interceptors.request.use(async (config) => {
  return config;
});

export default api;

export const clientApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      'ngrok-skip-browser-warning': 'true',
    },
  });
  
  // Add same interceptor for clientApi if needed
  clientApi.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  });

export const baseFetch = async (url: string, options = {}) => {
  const token = localStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    headers,
  });
  return response.json();
};
