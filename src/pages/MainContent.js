import React, { useState, useEffect } from "react";
import { fetchDashboardCategories, fetchProductsByCategory, checkout, fetchCustomers } from "../api/axios";
import { useConfig } from "../contexts/ConfigContext";
import { FaSearch, FaTrash, FaPlus, FaMinus } from "react-icons/fa";

const AdvancedDropdown = ({ customers, selectedCustomer, setSelectedCustomer }) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredCustomers = customers.filter((customer) => 
    customer.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (selectedCustomer) {
      const selected = customers.find((customer) => customer.id === selectedCustomer);
      if (selected) setSearch(selected.name);
    }
  }, [selectedCustomer, customers]);

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer.id);
    setSearch(customer.name);
    setIsOpen(false);
  };

  return (
    <div className="mt-6 relative">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Assign Customer</h2>
      <div className="relative">
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            onFocus={() => setIsOpen(true)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <div 
                  key={customer.id} 
                  onClick={() => handleCustomerSelect(customer)} 
                  className={`p-3 cursor-pointer hover:bg-blue-50 flex items-center border-b border-gray-100 last:border-0 ${
                    selectedCustomer === customer.id ? "bg-blue-100" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{customer.name}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {customer.email || "No email provided"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-500 text-sm text-center">No customers found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const MainContent = ({ updateCartTotal }) => {
  const { config } = useConfig();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      setCart(savedCart);
    }

    const fetchInitialData = async () => {
      setLoading(true);
      setError("");
      try {
        const [categoriesResponse, customersResponse] = await Promise.all([
          fetchDashboardCategories(), 
          fetchCustomers()
        ]);
        setCategories(categoriesResponse.data.categories || []);
        setCustomers(customersResponse.data.customers || []);
        if (categoriesResponse.data.categories.length > 0) {
          handleCategoryClick(categoriesResponse.data.categories[0].id);
        }
      } catch (err) {
        console.error("Error fetching data:", err.message);
        setError(err.message || "Error loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleCategoryClick = async (categoryId) => {
    setLoading(true);
    setError("");
    setSelectedCategory(categoryId);

    try {
      const productsResponse = await fetchProductsByCategory(categoryId);
      setProducts(productsResponse.data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err.message);
      setError(err.message || "Error loading products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }

    const calculateTotal = () => {
      return cart
        .reduce((total, item) => {
          return total + parseFloat(item.sale_price.replace(/[^0-9.-]+/g, "")) * item.quantity;
        }, 0)
        .toFixed(2);
    };

    const total = calculateTotal();
    updateCartTotal(parseFloat(total));
  }, [cart, updateCartTotal]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCart((prevCart) => 
      prevCart.map((item) => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => 
        total + parseFloat(item.sale_price.replace(/[^0-9.-]+/g, "")) * item.quantity, 
      0)
      .toFixed(2);
  };

  const handleCheckout = async () => {
    try {
      const saleData = {
        items: cart.map(({ id, name, quantity, sale_price }) => ({
          id,
          name,
          quantity,
          price: parseFloat(sale_price.replace(/[^0-9.-]+/g, "")),
        })),
        totalAmount: parseFloat(calculateTotal()),
        customer_id: selectedCustomer || null,
      };

      const response = await checkout(saleData);
      console.log("Checkout successful:", response.data);

      setCart([]);
      setSelectedCustomer(null);
      localStorage.removeItem("cart");
      alert("Checkout successful!");
    } catch (error) {
      console.error("Checkout failed:", error.message);
      alert(error.message || "Something went wrong during checkout.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Categories Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Categories</h2>
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`flex-shrink-0 px-6 py-3 rounded-lg transition-all ${
                      selectedCategory === category.id
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                    }`}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Products and Cart Section */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Products Section */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                    >
                      <div className="relative pb-[75%]">
                        <img
                          src={`${baseUrl}/uploads/${product.image}`}
                          alt={product.name}
                          className="absolute h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-blue-600 font-bold">
                          {config.currencySign}
                          {product.sale_price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Section */}
              <div className="w-full lg:w-96">
                <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h2>
                  
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Your cart is empty</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Click on products to add them to your cart
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="max-h-[400px] overflow-y-auto pr-2">
                        {cart.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0"
                          >
                            <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                              {item.image && (
                                <img
                                  src={`${baseUrl}/uploads/${item.image}`}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-800 truncate">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {config.currencySign}
                                {item.sale_price} each
                              </p>
                              <div className="flex items-center mt-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateQuantity(item.id, item.quantity - 1);
                                  }}
                                  className="text-gray-500 hover:text-blue-600 p-1"
                                >
                                  <FaMinus size={12} />
                                </button>
                                <input
                                  type="number"
                                  value={item.quantity}
                                  min="1"
                                  onChange={(e) =>
                                    updateQuantity(item.id, parseInt(e.target.value, 10))
                                  }
                                  className="w-12 text-center border-0 border-b border-gray-200 focus:border-blue-500 focus:ring-0 mx-1"
                                />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateQuantity(item.id, item.quantity + 1);
                                  }}
                                  className="text-gray-500 hover:text-blue-600 p-1"
                                >
                                  <FaPlus size={12} />
                                </button>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <p className="font-medium">
                                {config.currencySign}
                                {(parseFloat(item.sale_price.replace(/[^0-9.-]+/g, "")) * item.quantity).toFixed(2)}
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFromCart(item.id);
                                }}
                                className="text-red-500 hover:text-red-700 mt-2"
                              >
                                <FaTrash size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Customer Selection */}
                      <AdvancedDropdown 
                        customers={customers} 
                        selectedCustomer={selectedCustomer} 
                        setSelectedCustomer={setSelectedCustomer} 
                      />

                      {/* Checkout Section */}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-medium text-gray-700">Subtotal:</span>
                          <span className="font-semibold">
                            {config.currencySign}
                            {calculateTotal()}
                          </span>
                        </div>
                        <button
                          onClick={handleCheckout}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                        >
                          Checkout Now
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MainContent;