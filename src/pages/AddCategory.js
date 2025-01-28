import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveCategory } from "../api/axios";
import Layout from "../layout/Layout";
import { FaSave } from "react-icons/fa";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    status: "active",
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

    try {
      const response = await saveCategory(formData);
      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        setError(null);
        setFormData({
          name: "",
          email: "",
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
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Add Category</h2>

        {/* Success Message */}
        {success && (
          <div className="text-green-500 bg-green-100 border border-green-400 rounded p-4 mb-4">
            <strong>Success!</strong> Category added successfully. Redirecting...
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
            <label className="block font-medium mb-2">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border px-4 py-2 rounded-lg" required />
          </div>
          <div>
            <label className="block font-medium mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
            <FaSave className="mr-2" /> Add Category
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddCategory;