import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { fetchStocks } from "../api/axios";
import { FaChevronLeft, FaChevronRight, FaSearch, FaBox } from "react-icons/fa";
import { useConfig } from "../contexts/ConfigContext";

const StockPage = () => {
  const { config } = useConfig();
  const [state, setState] = useState({
    stocks: [],
    loading: true,
    error: "",
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
    cartTotal: 0,
    searchTerm: "",
  });

  // Calculate the cart total from localStorage
  useEffect(() => {
    const calculateCartTotal = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      return cart.reduce((total, item) => total + parseFloat(item.sale_price.replace(/[^0-9.-]+/g, "")) * item.quantity, 0).toFixed(2);
    };

    const total = parseFloat(calculateCartTotal());
    setState((prev) => ({ ...prev, cartTotal: total }));
  }, []);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setState((prev) => ({ ...prev, currentPage: 1 }));
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [state.searchTerm]);

  // Fetch data
  useEffect(() => {
    const fetchStockData = async () => {
      setState((prev) => ({ ...prev, loading: true, error: "" }));
      try {
        const response = await fetchStocks({
          page: state.currentPage,
          per_page: state.perPage,
          search: state.searchTerm,
        });

        setState((prev) => ({
          ...prev,
          stocks: response.data?.data || [],
          currentPage: response.data?.current_page || 1,
          lastPage: response.data?.last_page || 1,
          total: response.data?.total || 0,
          loading: false,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err.message || "Failed to load stocks",
          loading: false,
        }));
      }
    };

    fetchStockData();
  }, [state.currentPage, state.perPage, state.searchTerm]);

  // Pagination and search
  const handlePageChange = (page) => {
    setState((prev) => ({ ...prev, currentPage: page }));
  };

  const handlePerPageChange = (e) => {
    setState((prev) => ({
      ...prev,
      perPage: Number(e.target.value),
      currentPage: 1,
    }));
  };

  const handleSearchChange = (e) => {
    setState((prev) => ({ ...prev, searchTerm: e.target.value }));
  };

  // UI Components
  const StatusBadge = ({ status }) => <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;

  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, state.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(state.lastPage, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-200 gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Show:</span>
            <select value={state.perPage} onChange={handlePerPageChange} className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              {[5, 10, 15, 20, 25].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-600 hidden sm:block">
            Showing <span className="font-medium">{(state.currentPage - 1) * state.perPage + 1}</span> to <span className="font-medium">{Math.min(state.currentPage * state.perPage, state.total)}</span> of <span className="font-medium">{state.total}</span> items
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => handlePageChange(state.currentPage - 1)} disabled={state.currentPage === 1} className={`p-2 border rounded-md ${state.currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"}`}>
            <FaChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex gap-1">
            {pageNumbers.map((page) => (
              <button key={page} onClick={() => handlePageChange(page)} className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-md ${page === state.currentPage ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                {page}
              </button>
            ))}
          </div>

          <button onClick={() => handlePageChange(state.currentPage + 1)} disabled={state.currentPage === state.lastPage} className={`p-2 border rounded-md ${state.currentPage === state.lastPage ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"}`}>
            <FaChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <Layout cartTotal={state.cartTotal}>
      <div className="min-h-screen bg-white p-4 md:p-6">
        {/* Page Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Stock Inventory</h1>
            <p className="text-gray-600">Manage your stock items</p>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input type="text" placeholder="Search stocks..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full" value={state.searchTerm} onChange={handleSearchChange} />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {state.loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : state.error ? (
            <div className="p-4 bg-red-50 text-red-700 rounded flex items-center">
              <FaBox className="mr-2" />
              {state.error}
            </div>
          ) : state.stocks.length === 0 ? (
            <div className="text-center p-12">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <FaBox className="w-full h-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No stock items found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Batch
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lot
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Buy Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sale Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {state.stocks.map((stock) => (
                      <tr key={stock.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{stock.product_name}</div>
                              <div className="text-sm text-gray-500">ID: {stock.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stock.batch || "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stock.lot || "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stock.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {config.currencySign}
                          {stock.buy_price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {config.currencySign}
                          {stock.sale_price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={stock.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination />
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StockPage;
