import React from "react";
import { FaChevronUp, FaChevronDown, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import MainContent from "../pages/MainContent";

const DashboardPage = () => {
  const [openMenu, setOpenMenu] = React.useState(null);
  const [cartTotal, setCartTotal] = React.useState(150); // Example cart total
  const userName = "John Doe"; // Example user name

  const toggleMenu = (menuName) => {
    setOpenMenu((prev) => (prev === menuName ? null : menuName));
  };

  const handleSignOut = () => {
    console.log("Sign out clicked");
    // Add sign out logic here (e.g., clear session, redirect, etc.)
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 h-screen bg-white shadow-md flex flex-col">
        <div className="flex items-center justify-between p-6 text-lg font-bold text-gray-700">
          <div>React POS</div>
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
              <span>£{cartTotal}</span>
            </div>
          </div>

          {/* Signout Button */}
          <button onClick={handleSignOut} className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center">
            <FaSignOutAlt className="mr-2" />
            Sign Out
          </button>
        </header>

        {/* Main Content Section */}
        <MainContent />
      </div>
    </div>
  );
};

export default DashboardPage;
