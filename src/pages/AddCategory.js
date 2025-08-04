import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveCategory } from "../api/axios";
import Layout from "../layout/Layout";
import { FaSave, FaPlusCircle } from "react-icons/fa";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    status: "active",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const calculateCartTotal = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      return cart.reduce((total, item) => total + parseFloat(item.sale_price.replace(/[^0-9.-]+/g, "")) * item.quantity, 0).toFixed(2);
    };

    const total = parseFloat(calculateCartTotal());
    setCartTotal(total);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await saveCategory(formData);
      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        setError(null);
        setFormData({
          name: "",
          status: "active",
        });

        setTimeout(() => {
          setSuccess(false);
          navigate("/categories");
        }, 3000);
      }
    } catch (error) {
      setError(error.message);
      setSuccess(false);
    }
  };

  return (
    <Layout cartTotal={cartTotal}>
      <div className="min-h-screen bg-white p-6 md:p-10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-8">
            <div className="bg-blue-600 p-3 rounded-full mr-4">
              <FaPlusCircle className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Add New Category</h2>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 animate-fade-in">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500 animate-bounce-in" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Success! Category added</h3>
                    <div className="mt-1 text-sm text-green-700">
                      <p>Your category has been successfully created. Redirecting...</p>
                    </div>
                    <div className="mt-3">
                      <div className="h-1 w-full bg-green-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full animate-countdown" style={{ animationDuration: "3s" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Enter category name" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
                  <FaSave className="mr-2" /> Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddCategory;
