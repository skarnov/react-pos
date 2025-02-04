import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { fetchIncomes } from "../api/axios";
import { useConfig } from "../contexts/ConfigContext";

const IncomePage = () => {
  const { config } = useConfig();
  const [incomes, setIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
        setFilteredIncomes(response.data.income || []);
      } catch (err) {
        console.error("Error fetching incomes:", err.message);
      }
    };

    fetchIncomeData();
  }, []);

  // Filter incomes by date range
  useEffect(() => {
    if (!startDate || !endDate) {
      setFilteredIncomes(incomes);
      return;
    }

    const filtered = incomes.filter((income) => {
      const incomeDate = new Date(income.created_at).toISOString().split("T")[0];
      return incomeDate >= startDate && incomeDate <= endDate;
    });

    setFilteredIncomes(filtered);
  }, [startDate, endDate, incomes]);

  return (
    <Layout cartTotal={cartTotal}>
      <div className="min-h-screen bg-gray-100 p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Incomes</h2>

        {/* Date Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg shadow-md">
          <div className="flex flex-col">
            <label className="text-black-700 font-medium mb-1">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
          </div>

          <div className="flex flex-col">
            <label className="text-black-700 font-medium mb-1">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
          </div>
        </div>

        {/* Income List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Description</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncomes.length > 0 ? (
                filteredIncomes.map((income) => (
                  <tr key={income.id} className="border">
                    <td className="border p-2">{income.description}</td>
                    <td className="border p-2">{formatDate(income.created_at)}</td>
                    <td className="border p-2">
                      {config.currencySign}
                      {income.amount}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center p-4 text-gray-500">
                    No incomes found for the selected dates.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default IncomePage;