import React, { useState } from "react";
import { FaChevronUp, FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import MainContent from "../pages/MainContent";

const DashboardPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menuName) => {
    setOpenMenu((prev) => (prev === menuName ? null : menuName));
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className={`w-${collapsed ? "20" : "64"} h-screen bg-white shadow-md flex flex-col transition-width duration-300`}>
        <div className="flex items-center justify-between p-6 text-lg font-bold text-gray-700">
          <div>React POS</div>
          <button className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center shadow-md focus:outline-none" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        {!collapsed && (
          <nav className="flex-1 px-4 space-y-2">
            <div>
              <button className="w-full flex justify-between py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200" onClick={() => toggleMenu("menu")}>
                Menu
                {openMenu === "menu" ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {openMenu === "menu" && (
                <div className="pl-6 space-y-1">
                  <a href="#" className="block py-2 text-gray-600 hover:bg-gray-200">
                    Submenu 1
                  </a>
                  <a href="#" className="block py-2 text-gray-600 hover:bg-gray-200">
                    Submenu 2
                  </a>
                </div>
              )}
            </div>
            <div>
              <button className="w-full flex justify-between py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200" onClick={() => toggleMenu("orderList")}>
                Order List
                {openMenu === "orderList" ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {openMenu === "orderList" && (
                <div className="pl-6 space-y-1">
                  <a href="#" className="block py-2 text-gray-600 hover:bg-gray-200">
                    Submenu 1
                  </a>
                  <a href="#" className="block py-2 text-gray-600 hover:bg-gray-200">
                    Submenu 2
                  </a>
                </div>
              )}
            </div>
            <div>
              <button className="w-full flex justify-between py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200" onClick={() => toggleMenu("history")}>
                History
                {openMenu === "history" ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {openMenu === "history" && (
                <div className="pl-6 space-y-1">
                  <a href="#" className="block py-2 text-gray-600 hover:bg-gray-200">
                    Submenu 1
                  </a>
                  <a href="#" className="block py-2 text-gray-600 hover:bg-gray-200">
                    Submenu 2
                  </a>
                </div>
              )}
            </div>
            <a href="#" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
              Bills
            </a>
            <a href="#" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200">
              Settings
            </a>
          </nav>
        )}
      </aside>
      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {/* Main Content Section */}
        <MainContent />
      </div>
    </div>
  );
};

export default DashboardPage;