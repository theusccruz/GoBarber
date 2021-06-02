import axios from 'axios';

const api = axios.create({
  baseURL: 'http://172.28.2.48:3333',
});

export default api;
