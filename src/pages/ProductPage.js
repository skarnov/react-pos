import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { fetchProducts, deleteProduct, updateProduct } from "../api/axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartTotal, setCartTotal] = useState(0);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updatedCategory, setUpdatedCategory] = useState("");
  const [updatedPrice, setUpdatedPrice] = useState("");
  const [updatedQuantity, setUpdatedQuantity] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  // Calculate the cart total from localStorage
  useEffect(() => {
    const calculateCartTotal = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      return cart.reduce((total, item) => total + parseFloat(item.sale_price.replace(/[^0-9.-]+/g, "")) * item.quantity, 0).toFixed(2);
    };

    const total = parseFloat(calculateCartTotal());
    setCartTotal(total);
  }, []);

  // Fetch product data from API
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetchProducts();
        setProducts(response.data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err.message);
        setError(err.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, []);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id);
      setProducts((prev) => prev.filter((product) => product.id !== productToDelete.id));
      alert("Product deleted successfully.");
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Error deleting product:", err.message);
      alert(err.message || "Failed to delete product.");
    }
  };

  const handleEditClick = (product) => {
    setProductToEdit(product);
    setUpdatedName(product.name);
    setUpdatedStatus(product.status);
    setUpdatedCategory(product.category_name);
    setUpdatedPrice(product.price);
    setUpdatedQuantity(product.quantity);
    setUpdatedDescription(product.description);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!updatedName || !updatedCategory || !updatedPrice || !updatedQuantity || !updatedDescription || !updatedStatus) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const updatedProduct = {
        ...productToEdit,
        name: updatedName,
        category_name: updatedCategory,
        price: updatedPrice,
        quantity: updatedQuantity,
        description: updatedDescription,
        status: updatedStatus,
      };

      await updateProduct(updatedProduct);
      setProducts((prev) => prev.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)));

      alert("Product updated successfully.");
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error updating product:", err.message);
      alert(err.message || "Failed to update product.");
    }
  };

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Layout cartTotal={cartTotal}>
      <div className="min-h-screen bg-gray-100 p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Products</h2>

        {/* Search Bar */}
        <div className="mb-6">
          <input type="text" placeholder="Search products..." className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-600" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {/* Product List */}
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {filteredProducts.length === 0 ? (
              <p className="p-6 text-gray-600">No products found.</p>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-3 px-4">Image</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Category Name</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-100">
                      <td className="py-3 px-4">
                        <img src={`http://127.0.0.1:8000/uploads/${product.image}`} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                      </td>
                      <td className="py-3 px-4">{product.name}</td>
                      <td className="py-3 px-4">{product.category_name}</td>
                      <td className="py-3 px-4 capitalize">{product.status}</td>
                      <td className="py-3 px-4 flex items-center space-x-2">
                        {/* Edit Button */}
                        <button type="button" onClick={() => handleEditClick(product)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center">
                          <FaEdit className="mr-2" />
                          Edit
                        </button>
                        {/* Delete Button */}
                        <button type="button" onClick={() => handleDeleteClick(product)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 flex items-center">
                          <FaTrash className="mr-2" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg w-96">
              <h2 className="text-2xl font-bold mb-6">Edit Product</h2>

              {/* Name Field */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700">
                  Name
                </label>
                <input id="name" type="text" value={updatedName} onChange={(e) => setUpdatedName(e.target.value)} className="w-full p-3 border rounded-md mt-2" />
              </div>

              {/* Category Field */}
              <div className="mb-4">
                <label htmlFor="category" className="block text-gray-700">
                  Category
                </label>
                <input id="category" type="text" value={updatedCategory} onChange={(e) => setUpdatedCategory(e.target.value)} className="w-full p-3 border rounded-md mt-2" />
              </div>

              {/* Price Field */}
              <div className="mb-4">
                <label htmlFor="price" className="block text-gray-700">
                  Price
                </label>
                <input id="price" type="number" value={updatedPrice} onChange={(e) => setUpdatedPrice(e.target.value)} className="w-full p-3 border rounded-md mt-2" />
              </div>

              {/* Stock Quantity Field */}
              <div className="mb-4">
                <label htmlFor="quantity" className="block text-gray-700">
                  Stock Quantity
                </label>
                <input id="quantity" type="number" value={updatedQuantity} onChange={(e) => setUpdatedQuantity(e.target.value)} className="w-full p-3 border rounded-md mt-2" />
              </div>

              {/* Description Field */}
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700">
                  Description
                </label>
                <textarea id="description" value={updatedDescription} onChange={(e) => setUpdatedDescription(e.target.value)} className="w-full p-3 border rounded-md mt-2" />
              </div>

              {/* Status Dropdown */}
              <div className="mb-4">
                <label htmlFor="status" className="block text-gray-700">
                  Status
                </label>
                <select id="status" value={updatedStatus} onChange={(e) => setUpdatedStatus(e.target.value)} className="w-full p-3 border rounded-md mt-2">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Horizontal Bar */}
              <hr className="my-3 border-t border-gray-300" />

              {/* Buttons */}
              <div className="flex justify-end space-x-4">
                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-md">
                  Cancel
                </button>
                <button onClick={handleEditSubmit} className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg w-96">
              <h2 className="text-2xl font-bold mb-6">Delete Product</h2>
              <p>Are you sure you want to delete this product?</p>

              {/* Horizontal Bar */}
              <hr className="my-3 border-t border-gray-300" />

              {/* Buttons */}
              <div className="flex justify-end space-x-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-md">
                  Cancel
                </button>
                <button onClick={handleDeleteProduct} className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductPage;