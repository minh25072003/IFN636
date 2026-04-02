import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001',
  //baseURL: 'http://3.25.216.63:5001',
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default axiosInstance;