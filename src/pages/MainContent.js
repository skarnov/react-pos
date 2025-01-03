import React, { useState } from "react";

const MainContent = () => {
  const categories = ["Electronics", "Clothing", "Groceries", "Books"]; // Dummy categories
  const products = [
    { id: 1, name: "Laptop", price: "$999", category: "Electronics" },
    { id: 2, name: "T-Shirt", price: "$19", category: "Clothing" },
    { id: 3, name: "Apple", price: "$2", category: "Groceries" },
    { id: 4, name: "Novel", price: "$15", category: "Books" },
    { id: 5, name: "Smartphone", price: "$699", category: "Electronics" },
    { id: 6, name: "Jeans", price: "$40", category: "Clothing" },
    { id: 7, name: "Banana", price: "$1", category: "Groceries" },
    { id: 8, name: "Cookbook", price: "$25", category: "Books" },
    { id: 8, name: "Cookbook", price: "$25", category: "Books" },
    { id: 8, name: "Cookbook", price: "$25", category: "Books" },
    { id: 8, name: "Cookbook", price: "$25", category: "Books" },
    { id: 8, name: "Cookbook", price: "$25", category: "Books" },
    { id: 8, name: "Cookbook", price: "$25", category: "Books" },
    { id: 8, name: "Cookbook", price: "$25", category: "Books" },
    { id: 8, name: "Cookbook", price: "$25", category: "Books" },
  ];

  const [cart, setCart] = useState([]);

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
    return cart.reduce((total, item) => total + parseFloat(item.price.slice(1)) * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="flex min-h-screen">
      {/* Main Content Section */}
      <div className="flex-1">
        {/* Header only for Dashboard */}

        {/* Main content area */}
        <main className="bg-gray-50 p-6 pt-6">
          {/* Categories Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
            <div className="flex space-x-4 mt-4">
              {categories.map((category, index) => (
                <button key={index} className="flex flex-col items-center p-4 bg-gray-100 hover:bg-gray-200 rounded-lg">
                  <span className="text-sm text-gray-600">{category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Products Section and Shopping Cart */}
          <div className="flex space-x-12">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Products</h2>
              <div className="grid grid-cols-4 gap-6 max-h-[600px] overflow-y-auto">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => addToCart(product)} // Add to cart on clicking the div
                    className="bg-white shadow-lg p-4 rounded-lg transform hover:scale-105 transition duration-300 relative group cursor-pointer"
                  >
                    {/* Product Image */}
                    <div className="relative">
                      <img src="https://via.placeholder.com/150" alt={product.name} className="w-full h-32 object-cover mb-4 rounded" />
                      <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">{product.category}</span>
                    </div>

                    {/* Product Name and Price */}
                    <h3 className="text-lg font-semibold text-gray-700">{product.name}</h3>
                    <p className="text-gray-500 mb-2">{product.price}</p>

                    {/* Transparent Overlay on Hover */}
                    <div className="absolute inset-0 bg-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shopping Cart */}
            <div className="w-96 bg-white shadow-md p-6 rounded-lg mt-11">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Shopping Cart</h2>
              {cart.length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
              ) : (
                <div>
                  <ul className="space-y-4">
                    {cart.map((item) => (
                      <li key={item.id} className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-700">{item.name}</h3>
                          <p className="text-gray-500">{item.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="number" value={item.quantity} min="1" onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))} className="w-16 text-center border border-gray-300 rounded" />
                          <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:text-red-800">
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex justify-between items-center">
                    <span className="font-semibold text-lg">Total:</span>
                    <span className="text-xl font-bold text-gray-800">${calculateTotal()}</span>
                  </div>
                  <button className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Checkout</button>
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