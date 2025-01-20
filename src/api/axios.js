import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

export const login = async (data) => {
  try {
    const response = await axiosInstance.post("/login", data);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Login failed");
  }
};

export const logout = async (token) => {
  try {
    const response = await axiosInstance.post("/logout", {}, { headers: getAuthHeaders(token) });
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Logout failed");
  }
};

export const fetchConfiguration = async (data) => {
  try {
    const response = await axiosInstance.post("/dashboard", data);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Error fetching configuration");
  }
};

export const fetchCategories = async (data) => {
  try {
    const response = await axiosInstance.post("/category", data);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Error fetching categories");
  }
};

export const fetchProductsByCategory = async (categoryId) => {
  try {
    const response = await axiosInstance.post(`/category-product/${categoryId}`);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Error fetching products by category");
  }
};

export const checkout = async (saleData) => {
  try {
    const response = await axiosInstance.post("/save-sale", saleData);
    return response;
  } catch (error) {
    console.error("Checkout Error:", error);
    throw new Error(error?.response?.data?.message || "Sale Error");
  }
};

export const fetchCustomers = async () => {
  try {
    const response = await axiosInstance.post("/customer");
    return response;
  } catch (error) {
    console.error("Fetch Customers Error:", error);
    throw new Error(error?.response?.data?.message || "Error fetching customers");
  }
};

export const deleteCustomer = async (customerId) => {
  try {
    const response = await axiosInstance.delete(`/delete-customer/${customerId}`);
    return response;
  } catch (error) {
    console.error("Delete Customer Error:", error);
    throw new Error(error?.response?.data?.message || "Error deleting customer");
  }
};

export default axiosInstance;
