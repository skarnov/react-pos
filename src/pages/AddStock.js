import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { saveStock, fetchProducts } from "../api/axios";
import Layout from "../layout/Layout";
import { FaSave, FaBoxes, FaArrowLeft } from "react-icons/fa";
import { debounce } from "lodash";

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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const dropdownListRef = useRef(null);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const calculateCartTotal = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      return cart.reduce((total, item) => total + parseFloat(item.sale_price.replace(/[^0-9.-]+/g, "")) * item.quantity, 0).toFixed(2);
    };

    const total = parseFloat(calculateCartTotal());
    setCartTotal(total);
  }, []);

  // Fetch products with pagination and search
  const fetchProductsData = useCallback(async (searchTerm = "", pageNum = 1) => {
    setIsFetching(true);
    try {
      const response = await fetchProducts({
        per_page: 10,
        page: pageNum,
        search: searchTerm,
      });

      const newProducts = response?.data?.data || [];

      if (pageNum === 1) {
        setProducts(newProducts);
      } else {
        setProducts((prev) => [...prev, ...newProducts]);
      }

      setHasMore(newProducts.length > 0);
      setPage(pageNum);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message || "Failed to load products.");
    } finally {
      setIsFetching(false);
      setLoading(false);
    }
  }, []);

  // Initial load and search handler with debounce
  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchProductsData(search, 1);
    }, 500);

    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [search, fetchProductsData]);

  // Infinite scroll handler
  useEffect(() => {
    const dropdownElement = dropdownListRef.current;
    if (!dropdownElement || !isOpen) return;

    const handleScroll = () => {
      if (dropdownElement.scrollTop + dropdownElement.clientHeight >= dropdownElement.scrollHeight - 100 && !isFetching && hasMore) {
        fetchProductsData(search, page + 1);
      }
    };

    dropdownElement.addEventListener("scroll", handleScroll);
    return () => dropdownElement.removeEventListener("scroll", handleScroll);
  }, [page, hasMore, isFetching, search, isOpen, fetchProductsData]);

  useEffect(() => {
    if (formData.product_id) {
      const selected = products.find((product) => product.id === formData.product_id);
      if (selected) {
        setSearch(selected.name);
      }
    }
  }, [formData.product_id, products]);

  const handleProductSelect = (product) => {
    setFormData((prev) => ({
      ...prev,
      product_id: product.id,
    }));
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

    if (!formData.product_id) {
      setError("Please select a product");
      return;
    }

    const form = new FormData();
    form.append("fk_product_id", formData.product_id || "");
    form.append("batch", formData.batch || "");
    form.append("lot", formData.lot || "");
    form.append("quantity", formData.quantity || "");
    form.append("buy_price", formData.buy_price || "");
    form.append("sale_price", formData.sale_price || "");
    form.append("status", formData.status || "active");

    try {
      setLoading(true);
      const response = await saveStock(form);

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
        setSearch("");

        setTimeout(() => {
          setSuccess(false);
          navigate("/stocks");
        }, 3000);
      }
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save stock.");
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
              <FaBoxes className="text-white text-lg md:text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Stock</h1>
          </div>

          {success && (
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
              <div className="flex items-center">
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm md:text-base">
                  <strong>Success!</strong> Stock added successfully. Redirecting...
                </span>
              </div>
            </div>
          )}

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 md:space-y-6">
                    <div className="relative" ref={dropdownRef}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Product *</label>
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          setIsOpen(true);
                        }}
                        onClick={() => setIsOpen(true)}
                        placeholder="Search products..."
                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-md md:rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white text-gray-900"
                      />
                      {isOpen && (
                        <div ref={dropdownListRef} className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {products.length > 0 ? (
                            <>
                              {products.map((product, index) => (
                                <div
                                  key={`${product.id}-${product.name}-${index}`}
                                  onClick={() => handleProductSelect(product)}
                                  className={`p-2 cursor-pointer hover:bg-gray-100 ${formData.product_id === product.id ? "bg-indigo-50" : ""}`}>
                                  {product.name}
                                  {product.sku && <span className="text-xs text-gray-500 ml-2">SKU: {product.sku}</span>}
                                </div>
                              ))}
                              {isFetching && <div className="p-2 text-center text-gray-500">Loading more products...</div>}
                            </>
                          ) : (
                            <div className="p-2 md:p-3 text-gray-500 text-sm md:text-base">{isFetching ? "Loading..." : "No products found"}</div>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Batch *</label>
                      <input type="text" name="batch" value={formData.batch} onChange={handleChange} required className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-md md:rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white text-gray-900" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">LOT *</label>
                      <input type="text" name="lot" value={formData.lot} onChange={handleChange} required className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-md md:rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white text-gray-900" />
                    </div>
                  </div>

                  <div className="space-y-4 md:space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                      <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-md md:rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white text-gray-900" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Buy Price *</label>
                      <input type="number" name="buy_price" value={formData.buy_price} onChange={handleChange} required className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-md md:rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white text-gray-900" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price *</label>
                      <input type="number" name="sale_price" value={formData.sale_price} onChange={handleChange} required className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-md md:rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white text-gray-900" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                      <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-md md:rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none bg-white text-gray-900">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="archive">Archive</option>
                      </select>
                    </div>
                  </div>
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
                        Add Stock
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

export default AddStock;
