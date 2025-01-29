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
    const response = await axiosInstance.post("/configuration", data);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Error fetching configuration");
  }
};

export const fetchDashboardCategories = async (data) => {
  try {
    const response = await axiosInstance.post("/dashboard", data);
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

export const saveCustomer = async (data) => {
  try {
    const response = await axiosInstance.post("/save-customer", data);
    return response;
  } catch (error) {
    console.error("Customer Save Error:", error);
    throw new Error(error?.response?.data?.message || "Customer Save Error");
  }
};

export const updateCustomer = async (customer) => {
  try {
    const response = await axiosInstance.put(`/update-customer/${customer.id}`, {
      name: customer.name,
      email: customer.email,
      status: customer.status || "active",
    });
    return response;
  } catch (error) {
    console.error("Update Customer Error:", error);
    throw new Error(error?.response?.data?.message || "Error updating customer");
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

export const fetchCategories = async (data) => {
  try {
    const response = await axiosInstance.post("/category", data);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Error fetching categories");
  }
};

export const saveCategory = async (data) => {
  try {
    const response = await axiosInstance.post("/save-category", data);
    return response;
  } catch (error) {
    console.error("Category Save Error:", error);
    throw new Error(error?.response?.data?.message || "Category Save Error");
  }
};

export const updateCategory = async (category) => {
  try {
    const response = await axiosInstance.put(`/update-category/${category.id}`, {
      name: category.name,
      status: category.status || "active",
    });
    return response;
  } catch (error) {
    console.error("Update Category Error:", error);
    throw new Error(error?.response?.data?.message || "Error updating category");
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const response = await axiosInstance.delete(`/delete-category/${categoryId}`);
    return response;
  } catch (error) {
    console.error("Delete Category Error:", error);
    throw new Error(error?.response?.data?.message || "Error deleting category");
  }
};

export const fetchProducts = async (data) => {
  try {
    const response = await axiosInstance.post("/product", data);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Error fetching products");
  }
};

export const saveProduct = async (data) => {
  try {
    const response = await axiosInstance.post("/save-product", data);
    return response;
  } catch (error) {
    console.error("Product Save Error:", error);
    throw new Error(error?.response?.data?.message || "Product Save Error");
  }
};

export const updateProduct = async (product) => {
  try {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("status", product.status || "active");
    formData.append("fk_category_id", product.category_id);
    formData.append("description", product.description);
    formData.append("sku", product.sku);
    formData.append("barcode", product.barcode);
    formData.append("specification", product.specification);
    
    if (product.image) {
      formData.append("image", product.image);
    }

    const response = await axiosInstance.post(`/update-product/${product.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response;
  } catch (error) {
    console.error("Update Product Error:", error);
    throw new Error(error?.response?.data?.message || "Error updating product");
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await axiosInstance.delete(`/delete-product/${productId}`);
    return response;
  } catch (error) {
    console.error("Delete Product Error:", error);
    throw new Error(error?.response?.data?.message || "Error deleting product");
  }
};

export default axiosInstance;