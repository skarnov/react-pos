import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveStock, fetchProducts } from "../api/axios";
import Layout from "../layout/Layout";
import { FaSave } from "react-icons/fa";

const AddStock = () => {
  const [formData, setFormData] = useState({
    product_id: "",
    lot: "",
    batch: "",
    quantity: "",
    buy_price: "",
    sale_price: "",
    status: "active",
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (formData.product_id) {
      const selected = products.find((product) => product.id === formData.product_id);
      if (selected) setSearch(selected.name);
    }
  }, [formData.product_id, products]);

  const handleProductSelect = (product) => {
    setFormData((prev) => ({ ...prev, product_id: product.id }));
    setSearch(product.name);
    setIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await saveStock(formData);
      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        setError(null);
        setFormData({
          product_id: "",
          lot: "",
          batch: "",
          quantity: "",
          buy_price: "",
          sale_price: "",
          status: "active",
        });
        setTimeout(() => navigate("/stocks"), 3000);
      }
    } catch (err) {
      setError(err.message || "Failed to save stock.");
      setSuccess(false);
    }
  };

  return (
    <Layout cartTotal={cartTotal}>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Add Stock</h2>

        {success && (
          <div className="text-green-500 bg-green-100 border border-green-400 rounded p-4 mb-4">
            <strong>Success!</strong> Stock added successfully. Redirecting...
          </div>
        )}

        {error && (
          <div className="text-red-500 bg-red-100 border border-red-400 rounded p-4 mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
          <div className="mb-4 relative">
            <label className="block font-medium mb-2">Select Product</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              onFocus={() => setIsOpen(true)}
              className="w-full border px-4 py-2 rounded-lg"
            />
            {isOpen && (
              <div className="absolute z-10 bg-white border rounded w-full shadow-md max-h-60 overflow-y-auto">
                {products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())).length > 0 ? (
                  products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())).map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                    >
                      {product.name}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500 text-sm">No products found</div>
                )}
              </div>
            )}
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

export default AddStock;
