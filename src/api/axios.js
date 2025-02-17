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

export const fetchStocks = async (data) => {
  try {
    const response = await axiosInstance.post("/stock", data);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Error fetching stocks");
  }
};

export const saveStock = async (data) => {
  try {
    const response = await axiosInstance.post("/save-stock", data);
    return response;
  } catch (error) {
    console.error("Stock Save Error:", error);
    throw new Error(error?.response?.data?.message || "Stock Save Error");
  }
};

export const updateStock = async (stock) => {
  try {
    const response = await axiosInstance.put(`/update-stock/${stock.id}`, {
      fk_product_id: stock.product_id,
      batch: stock.batch,
      lot: stock.lot,
      quantity: stock.quantity,
      buy_price: stock.buy_price,
      sale_price: stock.sale_price,
      status: stock.status || "active",
    });
    return response;
  } catch (error) {
    console.error("Update Stock Error:", error);
    throw new Error(error?.response?.data?.message || "Error updating stock");
  }
};

export const deleteStock = async (stockId) => {
  try {
    const response = await axiosInstance.delete(`/delete-stock/${stockId}`);
    return response;
  } catch (error) {
    console.error("Delete Stock Error:", error);
    throw new Error(error?.response?.data?.message || "Error deleting stock");
  }
};

export const fetchSale = async () => {
  try {
    const response = await axiosInstance.post("/sale");
    return response;
  } catch (error) {
    console.error("Fetch Sale Error:", error);
    throw new Error(error?.response?.data?.message || "Error fetching sales");
  }
};

export const fetchSaleDetails = async (saleId) => {
  try {
    const response = await axiosInstance.post(`/select-sale/${saleId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch sale details.");
  }
};

export const deleteSale = async (saleId) => {
  try {
    const response = await axiosInstance.delete(`/delete-sale/${saleId}`);
    return response;
  } catch (error) {
    console.error("Delete Sale Error:", error);
    throw new Error(error?.response?.data?.message || "Error deleting sale");
  }
};

export const fetchIncomes = async (data) => {
  try {
    const response = await axiosInstance.post("/income", data);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Error fetching incomes");
  }
};

export const saveIncome = async (data) => {
  try {
    const response = await axiosInstance.post("/save-income", data);
    return response;
  } catch (error) {
    console.error("Income Save Error:", error);
    throw new Error(error?.response?.data?.message || "Income Save Error");
  }
};

export const fetchExpenses = async (data) => {
  try {
    const response = await axiosInstance.post("/expense", data);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Error fetching expenses");
  }
};

export const saveExpense = async (data) => {
  try {
    const response = await axiosInstance.post("/save-expense", data);
    return response;
  } catch (error) {
    console.error("Expense Save Error:", error);
    throw new Error(error?.response?.data?.message || "Expense Save Error");
  }
};

export const fetchReports = async (data) => {
  try {
    const response = await axiosInstance.post("/report", data);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Error fetching reports");
  }
};

export default axiosInstance;