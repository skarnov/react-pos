import React from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronUp, FaChevronDown, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import MainContent from "../pages/MainContent";
import { logout } from "../api/axios.js";

const DashboardPage = () => {
  const [openMenu, setOpenMenu] = React.useState(null);

  const [cartTotal, setCartTotal] = React.useState(0);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const updateCartTotal = (total) => {
    setCartTotal(total);
  };

  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();

  const toggleMenu = (menuName) => {
    setOpenMenu((prev) => (prev === menuName ? null : menuName));
  };

  const handleSignOut = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        await logout(token);
        console.log("User logged out successfully");
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        navigate("/login");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    } else {
      console.log("No token found, redirecting to login...");
      navigate("/login");
    }
  };
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
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
                <a href="#" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
                  Add Customer
                </a>
                <a href="#" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
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
                <a href="#" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
                  Add Category
                </a>
                <a href="#" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
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
                <a href="#" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
                  Add Product
                </a>
                <a href="#" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
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
                <a href="#" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
                  Add Stock
                </a>
                <a href="#" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
                  Manage Stock
                </a>
              </div>
            )}
          </div>
          <div>
            <button className="w-full flex justify-between py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200" onClick={() => toggleMenu("sale")}>
              Sale
              {openMenu === "sale" ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openMenu === "sale" && (
              <div className="pl-6 space-y-1">
                <a href="#" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
                  Add Sale
                </a>
                <a href="#" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
                  Manage Sale
                </a>
              </div>
            )}
          </div>
          <a href="#" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
            Income
          </a>
          <a href="#" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
            Expense
          </a>
          <a href="#" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
            Account Statement
          </a>
          <a href="#" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
            About
          </a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* User Name */}
            <span className="text-xl font-semibold">{userName}</span>
            {/* Cart Total */}
            <div className="flex items-center space-x-2">
              <FaShoppingCart />
              <span>Cart Total: £{cartTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Signout Button */}
          <button onClick={handleSignOut} className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center">
            <FaSignOutAlt className="mr-2" />
            Sign Out
          </button>
        </header>

        {/* Main Content Section */}
        <MainContent updateCartTotal={updateCartTotal} />
      </div>
    </div>
  );
};

export default DashboardPage;