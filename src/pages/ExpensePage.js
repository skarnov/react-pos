import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { fetchExpenses } from "../api/axios";
import { useConfig } from "../contexts/ConfigContext";

const ExpensePage = () => {
  const { config } = useConfig();
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
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
    const fetchExpenseData = async () => {
      try {
        const response = await fetchExpenses();
        setExpenses(response.data.expense || []);
        setFilteredExpenses(response.data.expense || []);
      } catch (err) {
        console.error("Error fetching expenses:", err.message);
      }
    };

    fetchExpenseData();
  }, []);

  // Filter expenses by date range
  useEffect(() => {
    if (!startDate || !endDate) {
      setFilteredExpenses(expenses);
      return;
    }

    const filtered = expenses.filter((expense) => {
      const expenseDate = new Date(expense.created_at).toISOString().split("T")[0];
      return expenseDate >= startDate && expenseDate <= endDate;
    });

    setFilteredExpenses(filtered);
  }, [startDate, endDate, expenses]);

  return (
    <Layout cartTotal={cartTotal}>
      <div className="min-h-screen bg-gray-100 p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Expenses</h2>

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

        {/* Expense List */}
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
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="border">
                    <td className="border p-2">{expense.description}</td>
                    <td className="border p-2">{formatDate(expense.created_at)}</td>
                    <td className="border p-2">
                      {config.currencySign}
                      {expense.amount}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center p-4 text-gray-500">
                    No expenses found for the selected dates.
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

export default ExpensePage;