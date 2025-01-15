import React, { useState, useEffect } from "react";
import { fetchCategories, fetchTopProducts } from "../api/axios";
import { useConfig } from '../contexts/ConfigContext';

const MainContent = ({ updateCartTotal }) => {
  const { config } = useConfig();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const [cart, setCart] = useState([]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    const fetchCategoryData = async () => {
      try {
        const response = await fetchCategories();
        setCategories(response.data.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err.message);
        setError(err.message);
      }
    };

    fetchCategoryData();

    const fetchProductData = async () => {
      try {
        const response = await fetchTopProducts();
        setProducts(response.data.mostSoldProducts || []);
      } catch (err) {
        console.error("Error fetching products:", err.message);
        setError(err.message);
      }
    };

    fetchProductData();
  }, []);

  // Recalculate total whenever cart changes
  useEffect(() => {
    // Save cart to localStorage whenever it changes
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }

    // Recalculate total whenever cart changes
    const calculateTotal = () => {
      return cart.reduce((total, item) => {
        return total + parseFloat(item.sale_price.replace(/[^0-9.-]+/g, "")) * item.quantity;
      }, 0).toFixed(2);
    };

    const total = calculateTotal();
    updateCartTotal(parseFloat(total));
  }, [cart, updateCartTotal]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);

      if (existingProduct) {
        // If product exists in the cart, increase its quantity
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // If product does not exist in the cart, add it with quantity 1
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

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="flex-1">
        <main className="bg-gray-50 p-6">
          {/* Categories Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
            <div className="flex space-x-4 mt-4">
              {categories.map((category, index) => (
                <button key={index} className="flex flex-col items-center p-4 bg-gray-100 hover:bg-gray-200 rounded-lg">
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
                    {/* Random Image */}
                    <img src={`http://127.0.0.1:8000/uploads/${product.image}`} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-4" />
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p>{config.currencySign}{product.sale_price}</p>
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
                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-700">{item.name}</h3>
                        <p className="text-sm text-gray-500">Price: {config.currencySign}{item.sale_price}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <input type="number" value={item.quantity} min="1" className="w-16 p-1 border rounded text-center" onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))} />
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Total Section */}
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-800">Total: {config.currencySign}{calculateTotal()}</h3>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 mt-4 rounded hover:bg-blue-700 transition">Checkout</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainContent;