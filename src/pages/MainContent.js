import React from "react";

const MainContent = () => {
  return (
    <main className="flex-1 bg-gray-50 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
      </header>

      {/* Content goes here */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Statistics</h2>
          <p className="text-gray-600">View overall system statistics.</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Orders</h2>
          <p className="text-gray-600">Manage and view orders.</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Reports</h2>
          <p className="text-gray-600">Generate and view reports.</p>
        </div>
      </section>
    </main>
  );
};

export default MainContent;
