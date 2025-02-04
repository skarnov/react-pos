import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { fetchIncomes } from "../api/axios";
import { useConfig } from "../contexts/ConfigContext";

const IncomePage = () => {
  const { config } = useConfig();
  const [incomes, setIncomes] = useState([]);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleString("en-GB", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace("am", "AM")
      .replace("pm", "PM");
  };

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const response = await fetchIncomes();
        setIncomes(response.data.income || []);
      } catch (err) {
        console.error("Error fetching incomes:", err.message);
      } finally {
      }
    };

    fetchIncomeData();
  }, []);

  return (
    <Layout cartTotal={cartTotal}>
      <div className="min-h-screen bg-gray-100 p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Incomes</h2>

        {/* Income List */}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Date</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((income) => (
                <tr key={income.id} className="border">
                  <td className="border p-2">{income.description}</td>
                  <td className="border p-2">{formatDate(income.created_at)}</td>
                  <td className="border p-2">{config.currencySign}{income.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default IncomePage;