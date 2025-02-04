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
    form.append("fk_product_id", getValueOrNull(formData.product_id));
    form.append("batch", getValueOrNull(formData.batch));
    form.append("lot", getValueOrNull(formData.lot));
    form.append("quantity", getValueOrNull(formData.quantity));
    form.append("buy_price", getValueOrNull(formData.buy_price));
    form.append("sale_price", getValueOrNull(formData.sale_price));
    form.append("status", getValueOrNull(formData.status));

    try {
      const response = await saveStock(form);
      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        setError(null);
        setFormData({
          fk_product_id: "",
          lot: "",
          batch: "",
          quantity: "",
          buy_price: "",
          sale_price: "",
          status: "active",
        });

        setTimeout(() => {
          setSuccess(false);
          navigate("/stocks");
        }, 3000);
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

        {/* Success Message */}
        {success && (
          <div className="text-green-500 bg-green-100 border border-green-400 rounded p-4 mb-4">
            <strong>Success!</strong> Stock added successfully. Redirecting...
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
            <div className="mb-4 relative">
              <label className="block font-medium mb-2">Select Product</label>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." onFocus={() => setIsOpen(true)} className="w-full border px-4 py-2 rounded-lg" disabled={loading} />
              {isOpen && (
                <div className="absolute z-10 bg-white border rounded w-full shadow-md max-h-60 overflow-y-auto">
                  {products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())).length > 0 ? (
                    products
                      .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
                      .map((product) => (
                        <div key={product.id} onClick={() => handleProductSelect(product)} className="p-2 cursor-pointer hover:bg-gray-100">
                          {product.name}
                        </div>
                      ))
                  ) : (
                    <div className="p-2 text-gray-500 text-sm">No products found</div>
                  )}
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Batch</label>
              <input type="text" name="batch" value={formData.batch} onChange={handleChange} required className="w-full border px-4 py-2 rounded-lg" />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">LOT</label>
              <input type="text" name="lot" value={formData.lot} onChange={handleChange} required className="w-full border px-4 py-2 rounded-lg" />
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
              <label className="block font-medium mb-2">Quantity</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required className="w-full border px-4 py-2 rounded-lg" />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Buy Price</label>
              <input type="number" name="buy_price" value={formData.buy_price} onChange={handleChange} required className="w-full border px-4 py-2 rounded-lg" />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Sale Price</label>
              <input type="number" name="sale_price" value={formData.sale_price} onChange={handleChange} required className="w-full border px-4 py-2 rounded-lg" />
            </div>
          </div>
          <div className="col-span-2">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
              <FaSave className="mr-2" /> Add Stock
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddStock;