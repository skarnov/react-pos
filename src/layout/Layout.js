import React, { useState, useEffect } from "react";
import { FaChevronUp, FaChevronDown, FaShoppingCart, FaSignOutAlt, FaUsers, FaTags, FaBoxes, FaWarehouse, FaCashRegister, FaMoneyBillWave, FaReceipt, FaChartBar, FaHome, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/axios";
import { useConfig } from "../contexts/ConfigContext";

const Layout = ({ children, cartTotal }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();
  const { config } = useConfig();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      {/* Mobile Menu Button */}
      {isMobile && (
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="fixed top-4 left-4 z-30 p-2 bg-indigo-700 text-white rounded-lg md:hidden">
          {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 h-screen bg-indigo-700 text-white flex flex-col fixed transition-transform duration-300 ease-in-out z-40
          ${isMobile ? (isMobileMenuOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}`}>
        <div className="p-6 text-xl font-bold border-b border-indigo-600">
          <Link to="/" className="flex items-center space-x-2 no-underline text-white hover:text-indigo-200" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
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
                <Link to="/add-customer" className="block py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-indigo-100" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
                  Add Customer
                </Link>
                <Link to="/customers" className="block py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-indigo-100" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
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
                <Link to="/add-category" className="block py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-indigo-100" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
                  Add Category
                </Link>
                <Link to="/categories" className="block py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-indigo-100" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
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
                <Link to="/add-product" className="block py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-indigo-100" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
                  Add Product
                </Link>
                <Link to="/products" className="block py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-indigo-100" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
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
                <Link to="/add-stock" className="block py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-indigo-100" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
                  Add Stock
                </Link>
                <Link to="/stocks" className="block py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-indigo-100" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
                  Manage Stocks
                </Link>
              </div>
            )}
          </div>

          {/* Sales */}
          <Link to="/sales" className="flex items-center py-3 px-4 rounded-lg hover:bg-indigo-600 transition-colors mb-2" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
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
                <Link to="/add-income" className="block py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-indigo-100" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
                  Add Income
                </Link>
                <Link to="/incomes" className="block py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-indigo-100" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
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
                <Link to="/add-expense" className="block py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-indigo-100" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
                  Add Expense
                </Link>
                <Link to="/expenses" className="block py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-indigo-100" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
                  Manage Expenses
                </Link>
              </div>
            )}
          </div>

          {/* Reports */}
          <Link to="/reports" className="flex items-center py-3 px-4 rounded-lg hover:bg-indigo-600 transition-colors" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
            <FaChartBar className="text-indigo-200 mr-3" />
            <span>Reports</span>
          </Link>
        </nav>

        {/* Mobile Sign Out Button */}
        {isMobile && (
          <div className="p-4 border-t border-indigo-600">
            <button onClick={handleSignOut} className="w-full flex items-center justify-center space-x-2 bg-red-100 hover:bg-red-200 text-red-600 py-2 px-4 rounded-lg transition-colors">
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${isMobile ? "ml-0" : "ml-64"}`}>
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center space-x-4 ml-12 md:ml-0">
            <span className="text-lg font-medium text-gray-800">Welcome, {userName}</span>
            <div className="flex items-center space-x-2 bg-indigo-100 px-3 py-2 rounded-lg">
              <FaShoppingCart className="text-indigo-600" />
              <span className="text-gray-700">
                Cart: {config.currencySign}
                {cartTotal.toFixed(2)}
              </span>
            </div>
          </div>
          {/* Hide sign out button on mobile since it's in the sidebar */}
          {!isMobile && (
            <button onClick={handleSignOut} className="flex items-center space-x-2 bg-red-100 hover:bg-red-200 text-red-600 py-2 px-4 rounded-lg transition-colors">
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
