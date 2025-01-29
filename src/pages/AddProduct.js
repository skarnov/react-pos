import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveProduct, fetchCategories } from "../api/axios";
import Layout from "../layout/Layout";
import { FaSave } from "react-icons/fa";

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
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
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

        setTimeout(() => {
          setSuccess(false);
          navigate("/products");
        }, 3000);
      }
    } catch (err) {
      setError(err.message || "Failed to save product.");
      setSuccess(false);
    }
  };

  return (
    <Layout cartTotal={cartTotal}>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Add Product</h2>

        {/* Success Message */}
        {success && (
          <div className="text-green-500 bg-green-100 border border-green-400 rounded p-4 mb-4">
            <strong>Success!</strong> Product added successfully. Redirecting...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-red-500 bg-red-100 border border-red-400 rounded p-4 mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border px-4 py-2 rounded-lg" required />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Category</label>
              <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full border px-4 py-2 rounded-lg" disabled={loading}>
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">SKU</label>
              <input type="text" name="sku" value={formData.sku} onChange={handleChange} required className="w-full border px-4 py-2 rounded-lg" />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full border px-4 py-2 rounded-lg">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archive">Archive</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Barcode</label>
              <input type="text" name="barcode" value={formData.barcode} onChange={handleChange} required className="w-full border px-4 py-2 rounded-lg" />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Image Upload</label>
              <input type="file" name="image" onChange={handleFileChange} className="w-full border px-4 py-2 rounded-lg" />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border px-4 py-2 rounded-lg" />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Specification</label>
              <textarea name="specification" value={formData.specification} onChange={handleChange} className="w-full border px-4 py-2 rounded-lg" />
            </div>
          </div>

          <div className="col-span-2">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
              <FaSave className="mr-2" /> Add Product
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddProduct;