import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import React from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [customerCount, setCustomers] = useState(0);
  const [stockValue, setStockValue] = useState(0);
  const [saleValue, setSaleValue] = useState(0);
  const [saleIncome, setSaleIncome] = useState(0);
  const [settings, setSettings] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await axios.post("/logout");
      localStorage.removeItem("auth_token");
      console.log("Logged out");
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await axios.post("/dashboard-data");
      const { customerCount, stockValue, saleValue, saleIncome , settings} = response.data;

      setCustomers(customerCount);
      setStockValue(stockValue);
      setSaleValue(saleValue);
      setSaleIncome(saleIncome);
      setSettings(settings);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-lg p-4">
        <nav className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">POS</h2>
          <ul className="flex space-x-6">
            <li>
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </a>
            </li>
            <li>
              <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </header>
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/customers" className="bg-white shadow-lg rounded-lg p-6 flex flex-col cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Customers</h2>
            <div className="h-40 bg-blue-100 flex items-center justify-center rounded-lg">
              <span className="text-gray-600 text-3xl font-bold">{customerCount}</span>
            </div>
          </Link>
          <Link to="/stocks" className="bg-white shadow-lg rounded-lg p-6 flex flex-col cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Stocks</h2>
            <div className="h-40 bg-green-100 flex items-center justify-center rounded-lg">
              <span className="text-gray-600 text-3xl font-bold">{settings.currency_sign}{stockValue}</span>
            </div>
          </Link>
          <Link to="/sales" className="bg-white shadow-lg rounded-lg p-6 flex flex-col cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Sales</h2>
            <div className="h-40 bg-yellow-100 flex items-center justify-center rounded-lg">
              <span className="text-gray-600 text-3xl font-bold">£{saleValue}</span>
            </div>
          </Link>
          <Link to="/sales-income" className="bg-white shadow-lg rounded-lg p-6 flex flex-col cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Sale Income</h2>
            <div className="h-40 bg-red-100 flex items-center justify-center rounded-lg">
              <span className="text-gray-600 text-3xl font-bold">£{saleIncome}</span>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;