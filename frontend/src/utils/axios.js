import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api',
  withCredentials: true,
});

export default instance;
