import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveIncome } from "../api/axios";
import Layout from "../layout/Layout";
import { FaSave } from "react-icons/fa";

const AddIncome = () => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const navigate = useNavigate();

  // Calculate the cart total from localStorage
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

    const form = new FormData();

    const getValueOrNull = (value) => (value === undefined || value === "" ? "" : value);

    form.append("description", getValueOrNull(formData.description));
    form.append("amount", getValueOrNull(formData.amount));

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
    }
  };

  return (
    <Layout cartTotal={cartTotal}>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Add Income</h2>

        {/* Success Message */}
        {success && (
          <div className="text-green-500 bg-green-100 border border-green-400 rounded p-4 mb-4">
            <strong>Success!</strong> Customer added successfully. Redirecting...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-red-500 bg-red-100 border border-red-400 rounded p-4 mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-2">Description</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full border px-4 py-2 rounded-lg" required />
          </div>
          <div>
            <label className="block font-medium mb-2">Amount</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="w-full border px-4 py-2 rounded-lg" required />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
            <FaSave className="mr-2" /> Add Income
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddIncome;