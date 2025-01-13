import axios from "axios";

// Create a reusable Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true, // Ensures cookies are sent with the request
});

// Add the token dynamically to the headers
const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

// Login function
export const login = async (data) => {
  try {
    const response = await axiosInstance.post("/login", data);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Login failed");
  }
};

// Logout function
export const logout = async (token) => {
  try {
    const response = await axiosInstance.post(
      "/logout", // Use the axios instance's baseURL
      {},
      { headers: getAuthHeaders(token) }
    );
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Logout failed");
  }
};

export default axiosInstance;
