import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/api",
  withCredentials: true,
});

export const login = async (data) => {
  return axiosInstance.post("/login", data);
};

export const logout = () => axiosInstance.post('/logout');

export default axiosInstance;