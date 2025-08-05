import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { fetchProducts, deleteProduct, updateProduct, fetchCategories } from "../api/axios";
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaPlus, FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaTimes, FaImage, FaBox, FaSearch } from "react-icons/fa";

const ProductPage = () => {
  // Main state
  const [state, setState] = useState({
    products: [],
    categories: [],
    loading: true,
    error: "",
    notification: null,
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
    cartTotal: 0,
    searchQuery: "",
  });

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

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setState((prev) => ({ ...prev, currentPage: 1 }));
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [state.searchQuery]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: "" }));

        const [productsRes, categoriesRes] = await Promise.all([
          fetchProducts({
            page: state.currentPage,
            per_page: state.perPage,
            search: state.searchQuery,
          }),
          fetchCategories({ per_page: "all" }),
        ]);

        setState((prev) => ({
          ...prev,
          products: productsRes.data?.data || [],
          categories: categoriesRes.data || [],
          currentPage: productsRes.data?.current_page || 1,
          lastPage: productsRes.data?.last_page || 1,
          total: productsRes.data?.total || 0,
          loading: false,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err.message || "Failed to load data",
          loading: false,
        }));
        showNotification(err.message || "Failed to load data", "error");
      }
    };

    fetchData();
  }, [state.currentPage, state.perPage, state.searchQuery]);

  // Calculate cart total
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart
      .reduce((sum, item) => {
        return sum + parseFloat(item.sale_price.replace(/[^0-9.-]+/g, "")) * item.quantity;
      }, 0)
      .toFixed(2);
    setState((prev) => ({ ...prev, cartTotal: parseFloat(total) }));
  }, []);

  // Notification helper
  const showNotification = (message, type = "info") => {
    setState((prev) => ({ ...prev, notification: { message, type } }));
    setTimeout(() => setState((prev) => ({ ...prev, notification: null })), 3000);
  };

  // Product actions
  const handleDeleteClick = (product) => {
    setDeleteModal({ isOpen: true, product });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(deleteModal.product.id);
      setState((prev) => ({
        ...prev,
        products: prev.products.filter((p) => p.id !== deleteModal.product.id),
      }));
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

      setState((prev) => ({
        ...prev,
        products: prev.products.map((p) => (p.id === editModal.product.id ? response.data : p)),
      }));
      showNotification("Product updated successfully", "success");
      setEditModal((prev) => ({ ...prev, isOpen: false }));
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setEditModal((prev) => ({ ...prev, loading: false }));
    }
  };

  // Pagination and search
  const handlePageChange = (page) => {
    setState((prev) => ({ ...prev, currentPage: page }));
  };

  const handlePerPageChange = (e) => {
    setState((prev) => ({
      ...prev,
      perPage: Number(e.target.value),
      currentPage: 1,
    }));
  };

  const handleSearchChange = (e) => {
    setState((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  // UI Components
  const StatusBadge = ({ status }) => <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${status === "active" ? "bg-green-100 text-green-800" : status === "inactive" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;

  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, state.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(state.lastPage, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-200 gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Show:</span>
            <select value={state.perPage} onChange={handlePerPageChange} className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              {[5, 10, 15, 20, 25].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-600 hidden sm:block">
            Showing <span className="font-medium">{(state.currentPage - 1) * state.perPage + 1}</span> to <span className="font-medium">{Math.min(state.currentPage * state.perPage, state.total)}</span> of <span className="font-medium">{state.total}</span> items
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => handlePageChange(state.currentPage - 1)} disabled={state.currentPage === 1} className={`p-2 border rounded-md ${state.currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"}`}>
            <FaChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex gap-1">
            {pageNumbers.map((page) => (
              <button key={page} onClick={() => handlePageChange(page)} className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-md ${page === state.currentPage ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                {page}
              </button>
            ))}
          </div>

          <button onClick={() => handlePageChange(state.currentPage + 1)} disabled={state.currentPage === state.lastPage} className={`p-2 border rounded-md ${state.currentPage === state.lastPage ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"}`}>
            <FaChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <Layout cartTotal={state.cartTotal}>
      <div className="min-h-screen bg-white p-4 md:p-6">
        {/* Notification */}
        {state.notification && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center max-w-md ${state.notification.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : state.notification.type === "error" ? "bg-red-50 text-red-800 border border-red-200" : "bg-blue-50 text-blue-800 border border-blue-200"}`}>
            {state.notification.type === "success" ? <FaCheckCircle className="mr-3 flex-shrink-0" /> : state.notification.type === "error" ? <FaExclamationTriangle className="mr-3 flex-shrink-0" /> : <FaInfoCircle className="mr-3 flex-shrink-0" />}
            <span className="text-sm">{state.notification.message}</span>
            <button onClick={() => setState((prev) => ({ ...prev, notification: null }))} className="ml-4 text-gray-400 hover:text-gray-500">
              <FaTimes />
            </button>
          </div>
        )}

        {/* Page Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Products</h1>
            <p className="text-gray-600">Manage your product inventory</p>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input type="text" placeholder="Search products..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full" value={state.searchQuery} onChange={handleSearchChange} />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {state.loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : state.error ? (
            <div className="p-4 bg-red-50 text-red-700 rounded flex items-center">
              <FaExclamationTriangle className="mr-2" />
              {state.error}
            </div>
          ) : state.products.length === 0 ? (
            <div className="text-center p-12">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <FaBox className="w-full h-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or add a new product</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SKU
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {state.products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">{product.name.charAt(0).toUpperCase()}</div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">ID: {product.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.sku || "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category_name || "Uncategorized"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={product.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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

              <Pagination />
            </>
          )}
        </div>

        {/* Edit Modal */}
        {editModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <FaBox className="text-blue-500 mr-2" />
                    Edit Product
                  </h2>
                  <button onClick={() => setEditModal((prev) => ({ ...prev, isOpen: false }))} className="text-gray-400 hover:text-gray-500">
                    <FaTimes className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleEditSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                        <input type="text" name="name" value={editModal.formData.name} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select name="fk_category_id" value={editModal.formData.fk_category_id} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                          <option value="">Select a category</option>
                          {state.categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                        <input type="text" name="sku" value={editModal.formData.sku} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Barcode *</label>
                        <input type="text" name="barcode" value={editModal.formData.barcode} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                        <select name="status" value={editModal.formData.status} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="archive">Archive</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                        <div className="flex items-center gap-4">
                          <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                            <FaImage className="mr-2" />
                            Choose File
                            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                          </label>
                          <span className="text-sm text-gray-500">{editModal.formData.image?.name || "No file chosen"}</span>
                        </div>

                        {(editModal.imagePreview || editModal.product?.image_url) && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
                            <img src={editModal.imagePreview || editModal.product.image_url} alt="Preview" className="h-32 w-32 object-contain border rounded-md" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" value={editModal.formData.description} onChange={handleEditChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
                    <textarea name="specification" value={editModal.formData.specification} onChange={handleEditChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                    <button type="button" onClick={() => setEditModal((prev) => ({ ...prev, isOpen: false }))} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Cancel
                    </button>
                    <button type="submit" disabled={editModal.loading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]">
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
              <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                <button type="button" onClick={() => setDeleteModal({ isOpen: false, product: null })} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Cancel
                </button>
                <button type="button" onClick={handleDeleteConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
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