import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000/api';

axios.defaults.withCredentials = true;

export const getCsrfToken = async () => {
  await axios.get('/sanctum/csrf-cookie');
};