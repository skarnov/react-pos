import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { fetchSale, deleteSale } from "../api/axios";
import { FaFileInvoice, FaTrash } from "react-icons/fa";

const SalePage = () => {
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartTotal, setCartTotal] = useState(0);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);

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
    const fetchSaleData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetchSale();
        setSales(response.data.sales || []);
      } catch (err) {
        console.error("Error fetching sales:", err.message);
        setError(err.message || "Failed to load sales.");
      } finally {
        setLoading(false);
      }
    };

    fetchSaleData();
  }, []);

  const handleDeleteClick = (sale) => {
    setSaleToDelete(sale);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSale = async () => {
    if (!saleToDelete) return;

    try {
      await deleteSale(saleToDelete.id);
      setSales((prev) => prev.filter((sale) => sale.id !== saleToDelete.id));
      alert("Sale deleted successfully.");
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Error deleting sale:", err.message);
      alert(err.message || "Failed to delete sale.");
    }
  };

  const filteredSales = sales.filter((sale) => sale.invoice_id.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Layout cartTotal={cartTotal}>
      <div className="min-h-screen bg-gray-100 p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales</h2>

        {/* Search Bar */}
        <div className="mb-6">
          <input type="text" placeholder="Search Invoice ID..." className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-600" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {/* Stock List */}
        {loading ? (
          <p>Loading Sales...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {filteredSales.length === 0 ? (
              <p className="p-6 text-gray-600">No sale found.</p>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-2">Invoice ID</th>
                    <th className="border p-2">Net Price</th>
                    <th className="border p-2">VAT</th>
                    <th className="border p-2">TAX</th>
                    <th className="border p-2">Total</th>
                    <th className="border p-2">Buy Price</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.map((sale) => (
                    <tr key={sale.id} className="border">
                      <td className="border p-2">{sale.invoice_id}</td>
                      <td className="border p-2">{sale.net_price}</td>
                      <td className="border p-2">{sale.vat_amount}</td>
                      <td className="border p-2">{sale.tax_amount}</td>
                      <td className="border p-2">{sale.grand_total}</td>
                      <td className="border p-2">{sale.buy_price}</td>
                      <td className="py-3 px-4 flex items-center space-x-2">
                        {/* Edit Button */}
                        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center">
                          <FaFileInvoice className="mr-2" />
                          View
                        </button>
                        {/* Delete Button */}
                        <button type="button" onClick={() => handleDeleteClick(sale)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 flex items-center">
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

        {/* Delete Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg w-96">
              <h2 className="text-2xl font-bold mb-6">Delete Sale</h2>
              <p>Are you sure you want to delete this sale?</p>

              {/* Horizontal Bar */}
              <hr className="my-3 border-t border-gray-300" />

              {/* Buttons */}
              <div className="flex justify-end space-x-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-md">
                  Cancel
                </button>
                <button onClick={handleDeleteSale} className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md">
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

export default SalePage;
