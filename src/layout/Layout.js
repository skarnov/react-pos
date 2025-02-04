import React from "react";
import { FaChevronUp, FaChevronDown, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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
    <div className="flex min-h-screen">
      <aside className="w-64 h-screen bg-white shadow-md flex flex-col">
        <div className="flex items-center justify-between p-6 text-lg font-bold text-gray-700">
          <div>
            <a href="/" className="no-underline text-inherit">
              React POS
            </a>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <div>
            <button className="w-full flex justify-between py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200" onClick={() => toggleMenu("customers")}>
              Customers
              {openMenu === "customers" ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openMenu === "customers" && (
              <div className="pl-6 space-y-1">
                <a href="/add-customer" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
                  Add Customer
                </a>
                <a href="/customers" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
                  Manage Customer
                </a>
              </div>
            )}
          </div>
          <div>
            <button className="w-full flex justify-between py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200" onClick={() => toggleMenu("category")}>
              Categories
              {openMenu === "category" ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openMenu === "category" && (
              <div className="pl-6 space-y-1">
                <a href="add-category" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
                  Add Category
                </a>
                <a href="/categories" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
                  Manage Category
                </a>
              </div>
            )}
          </div>
          <div>
            <button className="w-full flex justify-between py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200" onClick={() => toggleMenu("product")}>
              Products
              {openMenu === "product" ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openMenu === "product" && (
              <div className="pl-6 space-y-1">
                <a href="add-product" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
                  Add Product
                </a>
                <a href="/products" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
                  Manage Product
                </a>
              </div>
            )}
          </div>
          <div>
            <button className="w-full flex justify-between py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200" onClick={() => toggleMenu("stocks")}>
              Stocks
              {openMenu === "stocks" ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openMenu === "stocks" && (
              <div className="pl-6 space-y-1">
                <a href="/add-stock" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
                  Add Stock
                </a>
                <a href="/stocks" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
                  Manage Stock
                </a>
              </div>
            )}
          </div>
          <a href="/sales" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
            Sales
          </a>
          <div>
            <button className="w-full flex justify-between py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200" onClick={() => toggleMenu("incomes")}>
              Incomes
              {openMenu === "incomes" ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openMenu === "incomes" && (
              <div className="pl-6 space-y-1">
                <a href="/add-income" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
                  Add Income
                </a>
                <a href="/incomes" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
                  Manage Income
                </a>
              </div>
            )}
          </div>
          <div>
            <button className="w-full flex justify-between py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200" onClick={() => toggleMenu("expenses")}>
              Expenses
              {openMenu === "expenses" ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openMenu === "expenses" && (
              <div className="pl-6 space-y-1">
                <a href="/add-expense" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
                  Add Expense
                </a>
                <a href="/expenses" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
                  Manage Expense
                </a>
              </div>
            )}
          </div>
          <a href="/reports" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
            Report
          </a>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-xl font-semibold">{userName}</span>
            <div className="flex items-center space-x-2">
              <FaShoppingCart />
              <span>
                Cart Total: {config.currencySign}
                {cartTotal.toFixed(2)}
              </span>
            </div>
          </div>
          <button onClick={handleSignOut} className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center">
            <FaSignOutAlt className="mr-2" /> Sign Out
          </button>
        </header>

        <div>{children}</div>
      </div>
    </div>
  );
};

export default Layout;