import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { fetchStocks, updateStock, deleteStock } from "../api/axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useConfig } from "../contexts/ConfigContext";

const StockPage = () => {
  const { config } = useConfig();
  const [stocks, setStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartTotal, setCartTotal] = useState(0);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [stockToDelete, setStockToDelete] = useState(null);
  const [stockToEdit, setStockToEdit] = useState(null);

  const [updatedBatch, setUpdatedBatch] = useState("");
  const [updatedLot, setUpdatedLot] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");

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
    const fetchStockData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetchStocks();
        setStocks(response.data.stocks || []);
      } catch (err) {
        console.error("Error fetching stocks:", err.message);
        setError(err.message || "Failed to load stocks.");
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  const handleDeleteClick = (stock) => {
    setStockToDelete(stock);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteStock = async () => {
    if (!stockToDelete) return;

    try {
      await deleteStock(stockToDelete.id);
      setStocks((prev) => prev.filter((stock) => stock.id !== stockToDelete.id));
      alert("Stock deleted successfully.");
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Error deleting stock:", err.message);
      alert(err.message || "Failed to delete stock.");
    }
  };

  const handleEditClick = (stock) => {
    setStockToEdit(stock);
    setUpdatedBatch(stock.batch);
    setUpdatedLot(stock.lot);
    setUpdatedStatus(stock.status);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!stockToEdit) return;

    try {
      const updatedStock = {
        id: stockToEdit.id,
        batch: updatedBatch,
        lot: updatedLot,
        status: updatedStatus,
      };
      await updateStock(updatedStock);
      setStocks((prev) => prev.map((s) => (s.id === updatedStock.id ? { ...s, ...updatedStock } : s)));
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error updating stock:", err.message);
    }
  };

  const filteredStocks = stocks.filter((stock) => stock.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Layout cartTotal={cartTotal}>
      <div className="min-h-screen bg-gray-100 p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Stocks</h2>

        {/* Search Bar */}
        <div className="mb-6">
          <input type="text" placeholder="Search stocks..." className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-600" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {/* Stock List */}
        {loading ? (
          <p>Loading stocks...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {filteredStocks.length === 0 ? (
              <p className="p-6 text-gray-600">No stock found.</p>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-2">Stock Name</th>
                    <th className="border p-2">Batch</th>
                    <th className="border p-2">Lot</th>
                    <th className="border p-2">Quantity</th>
                    <th className="border p-2">Buy Price</th>
                    <th className="border p-2">Sale Price</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStocks.map((stock) => (
                    <tr key={stock.id} className="border">
                      <td className="border p-2">{stock.name}</td>
                      <td className="border p-2">{stock.batch}</td>
                      <td className="border p-2">{stock.lot}</td>
                      <td className="border p-2">{stock.quantity}</td>
                      <td className="border p-2">{config.currencySign}{stock.buy_price}</td>
                      <td className="border p-2">{config.currencySign}{stock.sale_price}</td>
                      <td className="border p-2 capitalize">{stock.status}</td>
                      <td className="py-3 px-4 flex items-center space-x-2">
                        {/* Edit Button */}
                        <button type="button" onClick={() => handleEditClick(stock)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center">
                          <FaEdit className="mr-2" />
                          Edit
                        </button>
                        {/* Delete Button */}
                        <button type="button" onClick={() => handleDeleteClick(stock)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 flex items-center">
                          <FaTrash className="mr-2" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Edit Stock</h2>
              <label className="block mb-2">Batch</label>
              <input type="text" value={updatedBatch} onChange={(e) => setUpdatedBatch(e.target.value)} className="w-full border p-2 rounded mb-4" />
              <label className="block mb-2">Lot</label>
              <input type="text" value={updatedLot} onChange={(e) => setUpdatedLot(e.target.value)} className="w-full border p-2 rounded mb-4" />
              <label className="block mb-2">Status</label>
              <select value={updatedStatus} onChange={(e) => setUpdatedStatus(e.target.value)} className="w-full border p-2 rounded mb-4">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="flex justify-end space-x-4">
                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-600">
                  Cancel
                </button>
                <button onClick={handleEditSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg w-96">
              <h2 className="text-2xl font-bold mb-6">Delete Stock</h2>
              <p>Are you sure you want to delete this stock?</p>

              {/* Horizontal Bar */}
              <hr className="my-3 border-t border-gray-300" />

              {/* Buttons */}
              <div className="flex justify-end space-x-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-md">
                  Cancel
                </button>
                <button onClick={handleDeleteStock} className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StockPage;