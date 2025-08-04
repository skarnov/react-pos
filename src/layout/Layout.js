import React from "react";
import { FaChevronUp, FaChevronDown, FaShoppingCart, FaSignOutAlt, FaUsers, FaTags, FaBoxes, FaWarehouse, FaCashRegister, FaMoneyBillWave, FaReceipt, FaChartBar, FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/axios";
import { useConfig } from "../contexts/ConfigContext";

const Layout = ({ children, cartTotal }) => {
  const [openMenu, setOpenMenu] = React.useState(null);
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();
  const { config } = useConfig();

  const toggleMenu = (menuName) => {
    setOpenMenu((prev) => (prev === menuName ? null : menuName));
  };

  const handleSignOut = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        await logout(token);
        localStorage.removeItem("authToken");
        navigate("/login");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 h-screen bg-indigo-700 text-white flex flex-col fixed">
        <div className="p-6 text-xl font-bold border-b border-indigo-600">
          <Link to="/" className="flex items-center space-x-2 no-underline text-white hover:text-indigo-200">
            <FaHome className="text-xl" />
            <span>React POS</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {/* Customers */}
          <div className="mb-2">
            <button className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-indigo-600 transition-colors" onClick={() => toggleMenu("customers")}>
              <div className="flex items-center space-x-3">
                <FaUsers className="text-indigo-200" />
                <span>Customers</span>
              </div>
              {openMenu === "customers" ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openMenu === "customers" && (
              <div className="pl-10 mt-1 space-y-1">
                <Link to="/add-customer" className="block py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-indigo-100">
                  Add Customer
                </Link>
                <Link to="/customers" className="block py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-indigo-100">
                  Manage Customers
                </Link>
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="mb-2">
            <button className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-indigo-600 transition-colors" onClick={() => toggleMenu("category")}>
              <div className="flex items-center space-x-3">
                <FaTags className="text-indigo-200" />
                <span>Categories</span>
              </div>
              {openMenu === "category" ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openMenu === "category" && (
              <div className="pl-10 mt-1 space-y-1">
                <Link to="/add-category" className="block py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-indigo-100">
                  Add Category
                </Link>
                <Link to="/categories" className="block py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-indigo-100">
                  Manage Categories
                </Link>
              </div>
            )}
          </div>

          {/* Products */}
          <div className="mb-2">
            <button className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-indigo-600 transition-colors" onClick={() => toggleMenu("product")}>
              <div className="flex items-center space-x-3">
                <FaBoxes className="text-indigo-200" />
                <span>Products</span>
              </div>
              {openMenu === "product" ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openMenu === "product" && (
              <div className="pl-10 mt-1 space-y-1">
                <Link to="/add-product" className="block py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-indigo-100">
                  Add Product
                </Link>
                <Link to="/products" className="block py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-indigo-100">
                  Manage Products
                </Link>
              </div>
            )}
          </div>

          {/* Stocks */}
          <div className="mb-2">
            <button className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-indigo-600 transition-colors" onClick={() => toggleMenu("stocks")}>
              <div className="flex items-center space-x-3">
                <FaWarehouse className="text-indigo-200" />
                <span>Stocks</span>
              </div>
              {openMenu === "stocks" ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openMenu === "stocks" && (
              <div className="pl-10 mt-1 space-y-1">
                <Link to="/add-stock" className="block py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-indigo-100">
                  Add Stock
                </Link>
                <Link to="/stocks" className="block py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-indigo-100">
                  Manage Stocks
                </Link>
              </div>
            )}
          </div>

          {/* Sales */}
          <Link to="/sales" className="flex items-center py-3 px-4 rounded-lg hover:bg-indigo-600 transition-colors mb-2">
            <FaCashRegister className="text-indigo-200 mr-3" />
            <span>Sales</span>
          </Link>

          {/* Incomes */}
          <div className="mb-2">
            <button className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-indigo-600 transition-colors" onClick={() => toggleMenu("incomes")}>
              <div className="flex items-center space-x-3">
                <FaMoneyBillWave className="text-indigo-200" />
                <span>Incomes</span>
              </div>
              {openMenu === "incomes" ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openMenu === "incomes" && (
              <div className="pl-10 mt-1 space-y-1">
                <Link to="/add-income" className="block py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-indigo-100">
                  Add Income
                </Link>
                <Link to="/incomes" className="block py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-indigo-100">
                  Manage Incomes
                </Link>
              </div>
            )}
          </div>

          {/* Expenses */}
          <div className="mb-2">
            <button className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-indigo-600 transition-colors" onClick={() => toggleMenu("expenses")}>
              <div className="flex items-center space-x-3">
                <FaReceipt className="text-indigo-200" />
                <span>Expenses</span>
              </div>
              {openMenu === "expenses" ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openMenu === "expenses" && (
              <div className="pl-10 mt-1 space-y-1">
                <Link to="/add-expense" className="block py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-indigo-100">
                  Add Expense
                </Link>
                <Link to="/expenses" className="block py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-indigo-100">
                  Manage Expenses
                </Link>
              </div>
            )}
          </div>

          {/* Reports */}
          <Link to="/reports" className="flex items-center py-3 px-4 rounded-lg hover:bg-indigo-600 transition-colors">
            <FaChartBar className="text-indigo-200 mr-3" />
            <span>Reports</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <span className="text-lg font-medium text-gray-800">Welcome, {userName}</span>
            <div className="flex items-center space-x-2 bg-indigo-100 px-3 py-2 rounded-lg">
              <FaShoppingCart className="text-indigo-600" />
              <span className="text-gray-700">
                Cart: {config.currencySign}
                {cartTotal.toFixed(2)}
              </span>
            </div>
          </div>
          <button onClick={handleSignOut} className="flex items-center space-x-2 bg-red-100 hover:bg-red-200 text-red-600 py-2 px-4 rounded-lg transition-colors">
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  );
};

export default Layout;