import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { fetchReports } from "../api/axios";
import { useConfig } from "../contexts/ConfigContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportPage = () => {
  const { config } = useConfig();
  const [cartTotal, setCartTotal] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [stockValue, setStockValue] = useState(0);
  const [salesThisYear, setSalesThisYear] = useState(Array(12).fill(0));
  const [salesLastYear, setSalesLastYear] = useState(Array(12).fill(0));
  const [incomeThisYear, setIncomeThisYear] = useState(Array(12).fill(0));
  const [incomeLastYear, setIncomeLastYear] = useState(Array(12).fill(0));
  const [expenseThisYear, setExpenseThisYear] = useState(Array(12).fill(0));
  const [expenseLastYear, setExpenseLastYear] = useState(Array(12).fill(0));

  // Calculate the cart total from localStorage
  useEffect(() => {
    const calculateCartTotal = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      return cart.reduce((total, item) => total + parseFloat(item.sale_price.replace(/[^0-9.-]+/g, "")) * item.quantity, 0).toFixed(2);
    };

    const total = parseFloat(calculateCartTotal());
    setCartTotal(total);
  }, []);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetchReports();
        setCustomerCount(response.data.customerCount);
        const rawStockValue = response.data.stockValue;
        const formattedStockValue = parseFloat(rawStockValue);

        if (isNaN(formattedStockValue)) {
          setStockValue(0);
        } else {
          setStockValue(formattedStockValue.toFixed(2));
        }
        setSalesThisYear(Object.values(response.data.sales_this_year));
        setSalesLastYear(Object.values(response.data.sales_last_year));
        setIncomeThisYear(Object.values(response.data.income_this_year));
        setIncomeLastYear(Object.values(response.data.income_last_year));
        setExpenseThisYear(Object.values(response.data.expense_this_year));
        setExpenseLastYear(Object.values(response.data.expense_last_year));
      } catch (err) {
        console.error("Error fetching reports:", err.message);
      }
    };

    fetchReportData();
  }, []);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const data = {
    labels: months,
    datasets: [
      {
        label: `Sales This Year`,
        data: salesThisYear,
        backgroundColor: "#28a745",
        borderWidth: 1,
      },
      {
        label: `Sales Last Year`,
        data: salesLastYear,
        backgroundColor: "#007bff",
        borderWidth: 1,
      },
      {
        label: `Income This Year`,
        data: incomeThisYear,
        backgroundColor: "#ffc107",
        borderWidth: 1,
      },
      {
        label: `Income Last Year`,
        data: incomeLastYear,
        backgroundColor: "#dc3545",
        borderWidth: 1,
      },
      {
        label: `Expense This Year`,
        data: expenseThisYear,
        backgroundColor: "#6c757d",
        borderWidth: 1,
      },
      {
        label: `Expense Last Year`,
        data: expenseLastYear,
        backgroundColor: "#17a2b8",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: "Monthly Comparison of Sales, Income, and Expenses (This Year vs Last Year)" },
    },
  };

  return (
    <Layout cartTotal={cartTotal}>
      <div className="min-h-screen bg-gray-100 p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Report</h2>

        {/* Summary Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-medium mb-2">Summary</h3>
          <p>
            <strong>Total Customers:</strong> {customerCount}
          </p>
          <p>
            <strong>Total Stock Value:</strong> £{stockValue}
          </p>
        </div>

        {/* Sales, Income, and Expense Comparison Chart */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <Bar data={data} options={options} />
        </div>

        {/* Individual Reports Section */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-2">Sales Report</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4>
                <strong>This Year</strong>
              </h4>
              <ul>
                {salesThisYear.map((value, index) => (
                  <li key={index}>
                    {months[index]}: {config.currencySign}
                    {parseFloat(value).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>
                <strong>Last Year</strong>
              </h4>
              <ul>
                {salesLastYear.map((value, index) => (
                  <li key={index}>
                    {months[index]}: {config.currencySign}
                    {parseFloat(value).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-2">Income Report</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4>
                <strong>This Year</strong>
              </h4>
              <ul>
                {incomeThisYear.map((value, index) => (
                  <li key={index}>
                    {months[index]}: {config.currencySign}
                    {parseFloat(value).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>
                <strong>Last Year</strong>
              </h4>
              <ul>
                {incomeLastYear.map((value, index) => (
                  <li key={index}>
                    {months[index]}: {config.currencySign}
                    {parseFloat(value).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-2">Expense Report</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4>
                <strong>This Year</strong>
              </h4>
              <ul>
                {expenseThisYear.map((value, index) => (
                  <li key={index}>
                    {months[index]}: {config.currencySign}
                    {parseFloat(value).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>
                <strong>Last Year</strong>
              </h4>
              <ul>
                {expenseLastYear.map((value, index) => (
                  <li key={index}>
                    {months[index]}: {config.currencySign}
                    {parseFloat(value).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportPage;