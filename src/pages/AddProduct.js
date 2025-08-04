import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveProduct, fetchCategories } from "../api/axios";
import Layout from "../layout/Layout";
import { FaSave, FaArrowLeft, FaImage, FaInfoCircle } from "react-icons/fa";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcode: "",
    status: "active",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const calculateCartTotal = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      return cart.reduce((total, item) => total + parseFloat(item.sale_price.replace(/[^0-9.-]+/g, "")) * item.quantity, 0).toFixed(2);
    };

    const total = parseFloat(calculateCartTotal());
    setCartTotal(total);
  }, []);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetchCategories();
        setCategories(response.data.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err.message);
        setError(err.message || "Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();

    const getValueOrNull = (value) => (value === undefined || value === "" ? '' : value);

    form.append("name", getValueOrNull(formData.name));
    form.append("fk_category_id", getValueOrNull(formData.category_id));
    form.append("status", getValueOrNull(formData.status));
    form.append("sku", getValueOrNull(formData.sku));
    form.append("barcode", getValueOrNull(formData.barcode));
    form.append("description", getValueOrNull(formData.description));
    form.append("specification", getValueOrNull(formData.specification));

    if (formData.image) {
      form.append("image", formData.image);
    }

    try {
      setLoading(true);
      const response = await saveProduct(form);
      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        setError(null);
        setFormData({
          name: "",
          category_id: "",
          status: "active",
          sku: "",
          barcode: "",
          description: "",
          specification: "",
          image: null,
        });
        setImagePreview(null);

        setTimeout(() => {
          setSuccess(false);
          navigate("/products");
        }, 3000);
      }
    } catch (err) {
      setError(err.message || "Failed to save product.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout cartTotal={cartTotal}>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Add New Product</h2>
        </div>

        {/* Status Messages */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Product added successfully. Redirecting to products page...
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  required 
                  placeholder="Enter product name"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select 
                  name="category_id" 
                  value={formData.category_id} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  disabled={loading}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                <input 
                  type="text" 
                  name="sku" 
                  value={formData.sku} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Stock Keeping Unit"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archive">Archive</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Barcode *</label>
                <input 
                  type="text" 
                  name="barcode" 
                  value={formData.barcode} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Product barcode"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <div className="mt-1 flex items-center">
                  <label className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                    <FaImage className="mr-2" />
                    Choose File
                    <input 
                      type="file" 
                      name="image" 
                      onChange={handleFileChange} 
                      className="sr-only" 
                      accept="image/*"
                    />
                  </label>
                  <span className="ml-3 text-sm text-gray-500">
                    {formData.image ? formData.image.name : "No file chosen"}
                  </span>
                </div>
                {imagePreview && (
                  <div className="mt-2">
                    <div className="text-sm text-gray-500 mb-1">Image Preview:</div>
                    <img src={imagePreview} alt="Preview" className="h-32 w-32 object-contain border rounded" />
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Product description (optional)"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
                <textarea 
                  name="specification" 
                  value={formData.specification} 
                  onChange={handleChange} 
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Product specifications (optional)"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Save Product
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </Layout>
  );
};

export default AddProduct;