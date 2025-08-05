import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { Bar, Line, Pie } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from "chart.js";
import { fetchReports } from "../api/axios";
import { useConfig } from "../contexts/ConfigContext";
import { FiTrendingUp, FiTrendingDown, FiUsers, FiPackage, FiShoppingCart } from "react-icons/fi";

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
);

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
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

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
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Calculate totals safely
  const calculateTotal = (arr) => parseFloat(arr.reduce((sum, val) => sum + parseFloat(val || 0), 0).toFixed(2));

  const totalSalesThisYear = calculateTotal(salesThisYear);
  const totalSalesLastYear = calculateTotal(salesLastYear);
  const totalIncomeThisYear = calculateTotal(incomeThisYear);
  const totalIncomeLastYear = calculateTotal(incomeLastYear);
  const totalExpenseThisYear = calculateTotal(expenseThisYear);
  const totalExpenseLastYear = calculateTotal(expenseLastYear);

  // Calculate percentage changes safely
  const calculateChange = (current, previous) => {
    const prev = parseFloat(previous);
    if (prev === 0) return 0;
    return ((parseFloat(current) - prev) / prev * 100).toFixed(1);
  };

  const salesChange = calculateChange(totalSalesThisYear, totalSalesLastYear);
  const incomeChange = calculateChange(totalIncomeThisYear, totalIncomeLastYear);
  const expenseChange = calculateChange(totalExpenseThisYear, totalExpenseLastYear);

  // Chart data configurations
  const salesData = {
    labels: months,
    datasets: [
      {
        label: `This Year (${new Date().getFullYear()})`,
        data: salesThisYear,
        backgroundColor: "rgba(74, 181, 235, 0.6)",
        borderColor: "rgba(74, 181, 235, 1)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
      {
        label: `Last Year (${new Date().getFullYear() - 1})`,
        data: salesLastYear,
        backgroundColor: "rgba(200, 200, 200, 0.6)",
        borderColor: "rgba(150, 150, 150, 1)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const financialData = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: incomeThisYear,
        backgroundColor: "rgba(102, 187, 106, 0.6)",
        borderColor: "rgba(102, 187, 106, 1)",
        borderWidth: 2,
      },
      {
        label: "Expenses",
        data: expenseThisYear,
        backgroundColor: "rgba(239, 83, 80, 0.6)",
        borderColor: "rgba(239, 83, 80, 1)",
        borderWidth: 2,
      },
    ],
  };

  const profitData = {
    labels: months,
    datasets: [
      {
        label: "Monthly Profit/Loss",
        data: incomeThisYear.map((income, i) => income - expenseThisYear[i]),
        backgroundColor: (ctx) => {
          const value = ctx.raw;
          return value >= 0 ? "rgba(102, 187, 106, 0.6)" : "rgba(239, 83, 80, 0.6)";
        },
        borderColor: (ctx) => {
          const value = ctx.raw;
          return value >= 0 ? "rgba(102, 187, 106, 1)" : "rgba(239, 83, 80, 1)";
        },
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { 
        position: "top",
        labels: {
          boxWidth: 12,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            let label = ctx.dataset.label || '';
            if (label) label += ': ';
            if (ctx.parsed.y !== null) {
              label += `${config.currencySign}${ctx.parsed.y.toFixed(2)}`;
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${config.currencySign}${value}`
        }
      }
    },
    maintainAspectRatio: false
  };

  if (loading) {
    return (
      <Layout cartTotal={cartTotal}>
        <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading report data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout cartTotal={cartTotal}>
      <div className="min-h-screen bg-white p-4 md:p-6">
        <div className="mx-auto">

          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Business Analytics Dashboard</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6 flex items-start">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <FiUsers className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Customers</p>
                <p className="text-2xl font-bold">{customerCount}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 flex items-start">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <FiPackage className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Stock Value</p>
                <p className="text-2xl font-bold">{config.currencySign}{stockValue}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 flex items-start">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <FiShoppingCart className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Cart</p>
                <p className="text-2xl font-bold">{config.currencySign}{cartTotal}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 flex items-start">
              <div className={`p-3 rounded-full mr-4 ${
                salesChange >= 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              }`}>
                {salesChange >= 0 ? <FiTrendingUp className="text-xl" /> : <FiTrendingDown className="text-xl" />}
              </div>
              <div>
                <p className="text-sm text-gray-500">Sales Growth</p>
                <p className={`text-2xl font-bold ${
                  salesChange >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {salesChange}%
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {["overview", "sales", "financials"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === "overview" && (
              <>
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Sales Trend Comparison</h2>
                  <div className="h-80">
                    <Line data={salesData} options={chartOptions} />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Income vs Expenses</h2>
                    <div className="h-64">
                      <Bar data={financialData} options={chartOptions} />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Profit Analysis</h2>
                    <div className="h-64">
                      <Bar data={profitData} options={chartOptions} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "sales" && (
              <div className="space-y-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Monthly Sales Data</h2>
                  <div className="h-96">
                    <Line data={salesData} options={chartOptions} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-medium mb-4">This Year's Sales by Month</h3>
                    <div className="space-y-3">
                      {salesThisYear.map((value, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-600">{months[index]}</span>
                          <span className="font-medium">
                            {config.currencySign}{parseFloat(value).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-medium mb-4">Last Year's Sales by Month</h3>
                    <div className="space-y-3">
                      {salesLastYear.map((value, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-600">{months[index]}</span>
                          <span className="font-medium">
                            {config.currencySign}{parseFloat(value).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "financials" && (
              <div className="space-y-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Financial Overview</h2>
                  <div className="h-96">
                    <Bar data={financialData} options={chartOptions} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-medium mb-4">Income Breakdown</h3>
                    <div className="h-64">
                      <Pie
                        data={{
                          labels: months,
                          datasets: [{
                            data: incomeThisYear,
                            backgroundColor: [
                              "#4CAF50", "#2196F3", "#FFC107", "#9C27B0", 
                              "#607D8B", "#FF5722", "#795548", "#E91E63",
                              "#3F51B5", "#00BCD4", "#8BC34A", "#FF9800"
                            ],
                          }]
                        }}
                        options={{
                          ...chartOptions,
                          plugins: {
                            tooltip: {
                              callbacks: {
                                label: (ctx) => {
                                  const value = ctx.raw || 0;
                                  const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                  const percentage = Math.round((value / total) * 100);
                                  return `${ctx.label}: ${config.currencySign}${value.toFixed(2)} (${percentage}%)`;
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-medium mb-4">Expense Breakdown</h3>
                    <div className="h-64">
                      <Pie
                        data={{
                          labels: months,
                          datasets: [{
                            data: expenseThisYear,
                            backgroundColor: [
                              "#F44336", "#673AB7", "#009688", "#FFEB3B", 
                              "#CDDC39", "#FF9800", "#795548", "#9E9E9E",
                              "#607D8B", "#3F51B5", "#2196F3", "#00BCD4"
                            ],
                          }]
                        }}
                        options={{
                          ...chartOptions,
                          plugins: {
                            tooltip: {
                              callbacks: {
                                label: (ctx) => {
                                  const value = ctx.raw || 0;
                                  const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                  const percentage = Math.round((value / total) * 100);
                                  return `${ctx.label}: ${config.currencySign}${value.toFixed(2)} (${percentage}%)`;
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Key Metrics Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Annual Performance Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Total Sales</p>
                      <p className="text-2xl font-bold mt-1">
                        {config.currencySign}{totalSalesThisYear}
                      </p>
                      <div className={`mt-2 text-sm ${
                        salesChange >= 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {salesChange >= 0 ? "↑" : "↓"} {Math.abs(salesChange)}% vs last year
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                      <FiTrendingUp className="text-xl" />
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Total Income</p>
                      <p className="text-2xl font-bold mt-1">
                        {config.currencySign}{totalIncomeThisYear}
                      </p>
                      <div className={`mt-2 text-sm ${
                        incomeChange >= 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {incomeChange >= 0 ? "↑" : "↓"} {Math.abs(incomeChange)}% vs last year
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-green-50 text-green-600">
                      <FiTrendingUp className="text-xl" />
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Total Expenses</p>
                      <p className="text-2xl font-bold mt-1">
                        {config.currencySign}{totalExpenseThisYear}
                      </p>
                      <div className={`mt-2 text-sm ${
                        expenseChange <= 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {expenseChange <= 0 ? "↓" : "↑"} {Math.abs(expenseChange)}% vs last year
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-red-50 text-red-600">
                      <FiTrendingDown className="text-xl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportPage;