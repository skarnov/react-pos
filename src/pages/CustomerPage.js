import React, { useEffect, useState } from "react";
import Layout from "../layout/Layout";

const CustomerPage = () => {
  const [cartTotal, setCartTotal] = useState(0);

  // Calculate the cart total from localStorage
  useEffect(() => {
    const calculateCartTotal = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      return cart.reduce((total, item) => total + parseFloat(item.sale_price.replace(/[^0-9.-]+/g, "")) * item.quantity, 0).toFixed(2);
    };

    const total = parseFloat(calculateCartTotal());
    setCartTotal(total);
  }, []);

  return (
    <Layout cartTotal={cartTotal}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Customer Management</h1>
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <p className="text-gray-600">This is the Customer Management Page. Add and manage customers here.</p>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerPage;
