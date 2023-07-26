import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api' // set this to the server's url
});

export default api;
