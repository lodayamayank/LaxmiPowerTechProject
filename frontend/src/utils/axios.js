import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://192.168.29.92:5000/api',
  withCredentials: true,
});

export default instance;
