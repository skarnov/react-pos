import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";
import { 
  fetchProducts, 
  fetchCategories, 
  deleteProduct, 
  updateProduct 
} from "../api/axios";
import { 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaTimes, 
  FaArrowLeft, 
  FaCheck,
  FaPlus,
  FaImage,
  FaInfoCircle
} from "react-icons/fa";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartTotal, setCartTotal] = useState(0);
  const navigate = useNavigate();

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);

  // Form data
  const [updatedData, setUpdatedData] = useState({
    name: "",
    sku: "",
    barcode: "",
    status: "active",
    category_id: "",
    description: "",
    specification: "",
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetchCategories(),
          fetchProducts()
        ]);
        
        setCategories(categoriesRes.data.categories || []);
        setProducts(productsRes.data.products || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load data");
        alert("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate cart total
  useEffect(() => {
    const calculateCartTotal = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      return cart.reduce((total, item) => 
        total + parseFloat(item.sale_price.replace(/[^0-9.-]+/g, "")) * item.quantity, 
      0).toFixed(2);
    };

    setCartTotal(parseFloat(calculateCartTotal()));
  }, []);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdatedData(prev => ({...prev, image: file}));
      
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Delete product handlers
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id);
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      alert("Product deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Error deleting product:", err);
      alert(err.message || "Failed to delete product");
    }
  };

  // Edit product handlers
  const handleEditClick = (product) => {
    setProductToEdit(product);
    setUpdatedData({
      name: product.name,
      sku: product.sku,
      barcode: product.barcode,
      status: product.status,
      description: product.description,
      specification: product.specification,
      category_id: product.fk_category_id,
      image: null
    });
    setImagePreview(null);
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData(prev => ({...prev, [name]: value}));
  };

  const handleEditSubmit = async () => {
    if (!updatedData.name) {
      alert("Product name is required");
      return;
    }
  
    try {
      const selectedCategory = categories.find(c => String(c.id) === String(updatedData.category_id));

      if (!selectedCategory) {
        alert("Selected category not found");
        return;
      }

      const updatedProduct = {
        id: productToEdit.id,
        ...updatedData,
        category_name: selectedCategory.name
      };

      await updateProduct(updatedProduct);
      
      setProducts(prev => prev.map(p => 
        p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p
      ));

      alert("Product updated successfully");
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error updating product:", err);
      alert(err.message || "Failed to update product");
    }
  };

// Filter products based on search term
const filteredProducts = products.filter(product => {
  const searchTermLower = searchTerm.toLowerCase();
  
  // Safely check each field with null/undefined protection
  const nameMatch = product.name 
    ? product.name.toLowerCase().includes(searchTermLower)
    : false;
    
  const skuMatch = product.sku 
    ? product.sku.toLowerCase().includes(searchTermLower)
    : false;
    
  const barcodeMatch = product.barcode 
    ? product.barcode.toLowerCase().includes(searchTermLower)
    : false;
    
  return nameMatch || skuMatch || barcodeMatch;
});

  return (
    <Layout cartTotal={cartTotal}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              {products.length} products in inventory
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={() => navigate("/products/add")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaPlus className="mr-2" />
              Add Product
            </button>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="mb-8 bg-white shadow rounded-lg p-4">
          <div className="relative rounded-md shadow-sm max-w-md mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products by name, SKU or barcode..."
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FaTimes />
                </button>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800">Active Products</h3>
              <p className="text-2xl font-semibold text-blue-600">
                {products.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-800">Inactive Products</h3>
              <p className="text-2xl font-semibold text-yellow-600">
                {products.filter(p => p.status === 'inactive').length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800">Total Categories</h3>
              <p className="text-2xl font-semibold text-green-600">
                {categories.length}
              </p>
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              <FaInfoCircle className="mx-auto text-2xl mb-2" />
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Try again
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center">
              <FaInfoCircle className="mx-auto text-2xl mb-2 text-gray-400" />
              <p className="text-gray-600">
                {searchTerm ? "No products match your search" : "No products found"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-2 text-blue-600 hover:text-blue-800"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
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
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-md object-cover" 
                              src={product.image ? `http://127.0.0.1:8000/uploads/${product.image}` : '/placeholder-product.png'} 
                              alt={product.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.barcode}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.category_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.sku}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && productToEdit && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Edit Product
                    </h3>
                    <button
                      onClick={() => setIsEditModalOpen(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Image
                          </label>
                          <div className="mt-1 flex items-center">
                            <div className="mr-4">
                              <img 
                                className="h-24 w-24 rounded-md object-cover" 
                                src={imagePreview || (productToEdit.image ? `http://127.0.0.1:8000/uploads/${productToEdit.image}` : '/placeholder-product.png')} 
                                alt="Product preview"
                              />
                            </div>
                            <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                              <FaImage className="inline mr-2" />
                              Change
                              <input 
                                type="file" 
                                className="sr-only" 
                                onChange={handleImageChange}
                                accept="image/*"
                              />
                            </label>
                          </div>
                        </div>

                        <div className="mb-4">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Product Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={updatedData.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        <div className="mb-4">
                          <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                            SKU *
                          </label>
                          <input
                            type="text"
                            name="sku"
                            id="sku"
                            value={updatedData.sku}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        <div className="mb-4">
                          <label htmlFor="barcode" className="block text-sm font-medium text-gray-700">
                            Barcode *
                          </label>
                          <input
                            type="text"
                            name="barcode"
                            id="barcode"
                            value={updatedData.barcode}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      {/* Right Column */}
                      <div>
                        <div className="mb-4">
                          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                            Category *
                          </label>
                          <select
                            name="category_id"
                            id="category_id"
                            value={updatedData.category_id}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="">Select a category</option>
                            {categories.map(category => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="mb-4">
                          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Status *
                          </label>
                          <select
                            name="status"
                            id="status"
                            value={updatedData.status}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>

                        <div className="mb-4">
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            name="description"
                            id="description"
                            rows="3"
                            value={updatedData.description}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        <div className="mb-4">
                          <label htmlFor="specification" className="block text-sm font-medium text-gray-700">
                            Specifications
                          </label>
                          <textarea
                            name="specification"
                            id="specification"
                            rows="3"
                            value={updatedData.specification}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleEditSubmit}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && productToDelete && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <FaTrash className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Delete Product
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete <strong>{productToDelete.name}</strong>? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleDeleteProduct}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductPage;