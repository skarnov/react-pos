import React, { useState, useEffect } from "react";
import { fetchCategories, fetchProductsByCategory, checkout } from "../api/axios";
import { useConfig } from "../contexts/ConfigContext";

const MainContent = ({ updateCartTotal }) => {
  const { config } = useConfig();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
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

    const fetchCategoryData = async () => {
      setLoading(true);
      setError("");
      try {
        const categoriesResponse = await fetchCategories();
        setCategories(categoriesResponse.data.categories || []);
        // Automatically load products for the first category
        if (categoriesResponse.data.categories.length > 0) {
          handleCategoryClick(categoriesResponse.data.categories[0].id);
        }
      } catch (err) {
        console.error("Error fetching categories:", err.message);
        setError(err.message || "Error loading categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
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
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item)));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + parseFloat(item.sale_price.replace(/[^0-9.-]+/g, "")) * item.quantity, 0).toFixed(2);
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
      };

      const response = await checkout(saleData);
      console.log("Checkout successful:", response.data);

      // Clear the cart and localStorage
      setCart([]);
      localStorage.removeItem("cart");
      alert("Checkout successful!");
    } catch (error) {
      console.error("Checkout failed:", error.message);
      alert(error.message || "Something went wrong during checkout.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="flex-1">
        <main className="bg-gray-50 p-6">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              {/* Categories Section */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
                <div className="flex space-x-4 mt-4">
                  {categories.map((category) => (
                    <button key={category.id} className={`flex flex-col items-center p-4 ${selectedCategory === category.id ? "bg-blue-200" : "bg-gray-100 hover:bg-gray-200"} rounded-lg`} onClick={() => handleCategoryClick(category.id)}>
                      <span className="text-sm text-gray-600">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Section */}
              <div className="flex space-x-12">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Products</h2>
                  <div className="grid grid-cols-4 gap-6 max-h-[600px] overflow-y-auto">
                    {products.map((product) => (
                      <div key={product.id} onClick={() => addToCart(product)} className="bg-white shadow-lg p-4 rounded-lg transform hover:scale-105 transition">
                        <img src={`${baseUrl}/uploads/${product.image}`} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-4" />
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p>
                          {config.currencySign}
                          {product.sale_price}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cart Section */}
                <div className="w-96 bg-white shadow-md p-6 rounded-lg mt-11">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Shopping Cart</h2>
                  {cart.length === 0 ? (
                    <p className="text-gray-500">Your cart is empty.</p>
                  ) : (
                    <div>
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between border-b py-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-700">{item.name}</h3>
                            <p className="text-sm text-gray-500">
                              Price: {config.currencySign}
                              {item.sale_price}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="number" value={item.quantity} min="1" className="w-16 p-1 border rounded text-center" onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))} />
                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Total: {config.currencySign}
                          {calculateTotal()}
                        </h3>
                        <button onClick={handleCheckout} className="w-full bg-blue-600 text-white py-2 px-4 mt-4 rounded hover:bg-blue-700 transition">
                          Checkout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default MainContent;