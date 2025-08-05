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
  const [totalIncome, setTotalIncome] = useState(0);

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

  // Filter incomes by date range and calculate total
  useEffect(() => {
    if (!startDate || !endDate) {
      setFilteredIncomes(incomes);
      const total = incomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);
      setTotalIncome(total);
      return;
    }

    const filtered = incomes.filter((income) => {
      const incomeDate = new Date(income.created_at).toISOString().split("T")[0];
      return incomeDate >= startDate && incomeDate <= endDate;
    });

    const total = filtered.reduce((sum, income) => sum + parseFloat(income.amount), 0);
    setTotalIncome(total);
    setFilteredIncomes(filtered);
  }, [startDate, endDate, incomes]);

  return (
    <Layout cartTotal={cartTotal}>
      <div className="min-h-screen bg-white p-4 md:p-8">
        <div className="mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Income Records</h2>
            <div className="mt-4 md:mt-0 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <span className="text-gray-600 font-medium mr-2">Total Income:</span>
                <span className="text-xl font-semibold text-green-600">
                  {config.currencySign}
                  {totalIncome.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Date Filters */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Filter Records</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Income List */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredIncomes.length > 0 ? (
                    filteredIncomes.map((income) => (
                      <tr key={income.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{income.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(income.created_at)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                          {config.currencySign}
                          {parseFloat(income.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                        No income records found {startDate || endDate ? "for the selected dates" : ""}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IncomePage;