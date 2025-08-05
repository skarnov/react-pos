import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveIncome } from "../api/axios";
import Layout from "../layout/Layout";
import { FaSave, FaMoneyBillWave, FaArrowLeft } from "react-icons/fa";

const AddIncome = () => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
  });

  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    const form = new FormData();
    form.append("description", formData.description || "");
    form.append("amount", formData.amount || "");

    try {
      const response = await saveIncome(form);
      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        setError(null);
        setFormData({
          description: "",
          amount: "",
        });

        setTimeout(() => {
          setSuccess(false);
          navigate("/incomes");
        }, 3000);
      }
    } catch (err) {
      setError(err.message || "Failed to save income.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout cartTotal={cartTotal}>
      <div className="min-h-screen bg-white text-gray-900 p-4 md:p-6">
        <div className="w-full">
          <div className="flex items-center mb-6">
            <div className="bg-indigo-600 p-2 md:p-3 rounded-full mr-3 md:mr-4">
              <FaMoneyBillWave className="text-white text-lg md:text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Income</h1>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
              <div className="flex items-center">
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm md:text-base">
                  <strong>Success!</strong> Income added successfully. Redirecting...
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <div className="flex items-center">
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm md:text-base">
                  <strong>Error:</strong> {error}
                </span>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md overflow-hidden border border-gray-200">
            <div className="p-4 sm:p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-md md:rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white text-gray-900" placeholder="Income description" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                  <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-md md:rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white text-gray-900" placeholder="0.00" required step="0.01" />
                </div>

                <div className="pt-2 md:pt-4 flex justify-between">
                  <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 md:px-6 md:py-3 border border-gray-300 rounded-md md:rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition text-sm md:text-base">
                    <FaArrowLeft className="mr-2 inline" />
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="px-4 py-2 md:px-6 md:py-3 border border-transparent rounded-md md:rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2 inline" />
                        Add Income
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddIncome;
