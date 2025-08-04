import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { fetchProducts, deleteProduct, updateProduct, fetchCategories } from "../api/axios";
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaPlus, FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaTimes, FaImage, FaBox } from "react-icons/fa";

const ProductPage = () => {
  // Main state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  });
  const [cartTotal, setCartTotal] = useState(0);

  // Modal states
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    product: null,
  });

  const [editModal, setEditModal] = useState({
    isOpen: false,
    product: null,
    formData: {
      name: "",
      sku: "",
      barcode: "",
      status: "active",
      description: "",
      specification: "",
      fk_category_id: "",
      image: null,
    },
    imagePreview: null,
    loading: false,
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [productsRes, categoriesRes] = await Promise.all([
          fetchProducts({
            page: pagination.currentPage,
            per_page: pagination.perPage,
          }),
          fetchCategories({ per_page: "all" }),
        ]);

        setProducts(productsRes.data?.data || []);
        setCategories(categoriesRes.data || []);
        setPagination((prev) => ({
          ...prev,
          currentPage: productsRes.data?.current_page || 1,
          lastPage: productsRes.data?.last_page || 1,
          total: productsRes.data?.total || 0,
        }));
      } catch (err) {
        setError(err.message || "Failed to load data");
        showNotification(err.message || "Failed to load data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pagination.currentPage, pagination.perPage]);

  // Calculate cart total
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart
      .reduce((sum, item) => {
        return sum + parseFloat(item.sale_price.replace(/[^0-9.-]+/g, "")) * item.quantity;
      }, 0)
      .toFixed(2);
    setCartTotal(parseFloat(total));
  }, []);

  // Notification helper
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Product actions
  const handleDeleteClick = (product) => {
    setDeleteModal({ isOpen: true, product });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(deleteModal.product.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteModal.product.id));
      showNotification("Product deleted successfully", "success");
      setDeleteModal({ isOpen: false, product: null });
    } catch (err) {
      showNotification(err.message || "Error deleting product", "error");
    }
  };

  const handleEditClick = (product) => {
    setEditModal({
      isOpen: true,
      product,
      formData: {
        name: product.name || "",
        sku: product.sku || "",
        barcode: product.barcode || "",
        status: product.status || "active",
        description: product.description || "",
        specification: product.specification || "",
        fk_category_id: product.fk_category_id || "",
        image: null,
      },
      imagePreview: product.image_url || null,
      loading: false,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditModal((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: value,
      },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditModal((prev) => ({
        ...prev,
        formData: {
          ...prev.formData,
          image: file,
        },
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setEditModal((prev) => ({
          ...prev,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditModal((prev) => ({ ...prev, loading: true }));

    try {
      const response = await updateProduct(editModal.product.id, editModal.formData);

      setProducts((prev) => prev.map((p) => (p.id === editModal.product.id ? response.data : p)));
      showNotification("Product updated successfully", "success");
      setEditModal((prev) => ({ ...prev, isOpen: false }));
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setEditModal((prev) => ({ ...prev, loading: false }));
    }
  };
  
  // Pagination
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  // UI Components
  const StatusBadge = ({ status }) => <span className={`px-2 py-1 text-xs rounded-full ${status === "active" ? "bg-green-100 text-green-800" : status === "inactive" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;

  return (
    <Layout cartTotal={cartTotal}>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 p-4 rounded shadow-lg z-50 flex items-center ${notification.type === "success" ? "bg-green-100 text-green-800" : notification.type === "error" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>
            {notification.type === "success" ? <FaCheckCircle className="mr-2" /> : notification.type === "error" ? <FaExclamationTriangle className="mr-2" /> : <FaInfoCircle className="mr-2" />}
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-4">
              <FaTimes />
            </button>
          </div>
        )}

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-700 rounded">
              <FaExclamationTriangle className="inline mr-2" />
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center p-12">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <FaBox className="w-full h-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new product.</p>
              <div className="mt-6">
                <button className="btn btn-primary">
                  <FaPlus className="mr-2" />
                  Add Product
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">{product.name.charAt(0).toUpperCase()}</div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">ID: {product.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{product.sku || "-"}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{product.category_name || "Uncategorized"}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={product.status} />
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <button onClick={() => handleEditClick(product)} className="text-blue-600 hover:text-blue-900 mr-4">
                            <FaEdit className="inline mr-1" /> Edit
                          </button>
                          <button onClick={() => handleDeleteClick(product)} className="text-red-600 hover:text-red-900">
                            <FaTrash className="inline mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.perPage + 1}</span> to <span className="font-medium">{Math.min(pagination.currentPage * pagination.perPage, pagination.total)}</span> of <span className="font-medium">{pagination.total}</span> products
                  </p>
                </div>
                <div className="flex-1 flex justify-between sm:justify-end">
                  <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1} className="btn btn-outline">
                    <FaChevronLeft className="mr-1" /> Previous
                  </button>
                  <div className="hidden sm:flex mx-2">
                    {Array.from({ length: Math.min(5, pagination.lastPage) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button key={page} onClick={() => handlePageChange(page)} className={`btn ${pagination.currentPage === page ? "btn-primary" : "btn-outline"}`}>
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.lastPage} className="btn btn-outline">
                    Next <FaChevronRight className="ml-1" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Edit Modal */}
        {editModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="bg-indigo-600 p-2 rounded-full mr-3">
                      <FaBox className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold">Edit Product</h2>
                  </div>
                  <button onClick={() => setEditModal((prev) => ({ ...prev, isOpen: false }))} className="text-gray-500 hover:text-gray-700 text-2xl">
                    &times;
                  </button>
                </div>

                <form onSubmit={handleEditSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Left Column */}
                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                        <input type="text" name="name" value={editModal.formData.name} onChange={handleEditChange} className="w-full p-2 border rounded" required />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select name="fk_category_id" value={editModal.formData.fk_category_id} onChange={handleEditChange} className="w-full p-2 border rounded">
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                        <input type="text" name="sku" value={editModal.formData.sku} onChange={handleEditChange} className="w-full p-2 border rounded" required />
                      </div>
                    </div>

                    {/* Right Column */}
                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Barcode *</label>
                        <input type="text" name="barcode" value={editModal.formData.barcode} onChange={handleEditChange} className="w-full p-2 border rounded" required />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                        <select name="status" value={editModal.formData.status} onChange={handleEditChange} className="w-full p-2 border rounded" required>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="archive">Archive</option>
                        </select>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                        {editModal.product?.image && !editModal.formData.image && (
                          <div className="mb-2">
                            <p className="text-sm text-gray-500 mb-1">Current Image:</p>
                            <img src={editModal.product.image} alt="Current" className="h-32 w-32 object-contain border rounded" />
                          </div>
                        )}
                        <div className="flex items-center">
                          <label className="btn btn-outline cursor-pointer">
                            <FaImage className="mr-2" />
                            {editModal.formData.image ? "Change File" : "Choose File"}
                            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                          </label>
                          <span className="ml-3 text-sm text-gray-500">{editModal.formData.image?.name || "No file chosen"}</span>
                        </div>
                        {editModal.imagePreview && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500 mb-1">New Image Preview:</p>
                            <img src={editModal.imagePreview} alt="Preview" className="h-32 w-32 object-contain border rounded" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" value={editModal.formData.description} onChange={handleEditChange} rows={3} className="w-full p-2 border rounded" />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
                    <textarea name="specification" value={editModal.formData.specification} onChange={handleEditChange} rows={3} className="w-full p-2 border rounded" />
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                    <button type="button" onClick={() => setEditModal((prev) => ({ ...prev, isOpen: false }))} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                      Cancel
                    </button>
                    <button type="submit" disabled={editModal.loading} className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center min-w-[120px]">
                      {editModal.loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {deleteModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <FaExclamationTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Delete product</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete <span className="font-semibold">{deleteModal.product?.name}</span>? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                <button type="button" onClick={() => setDeleteModal({ isOpen: false, product: null })} className="btn btn-outline">
                  Cancel
                </button>
                <button type="button" onClick={handleDeleteConfirm} className="btn btn-danger">
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
