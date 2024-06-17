import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/', // set this to the server's url
  withCredentials: true
});

export default api;
