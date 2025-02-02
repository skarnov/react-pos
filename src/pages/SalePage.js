import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { fetchSale, fetchSaleDetails, deleteSale } from "../api/axios";
import { FaFileInvoice, FaTrash, FaDownload } from "react-icons/fa";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const SalePage = () => {
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartTotal, setCartTotal] = useState(0);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [saleDetails, setSaleDetails] = useState(null);

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

  const handleViewClick = async (saleId) => {
    try {
      const data = await fetchSaleDetails(saleId);
      setSaleDetails(data);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Error fetching sale details:", error.message);
      alert(error.message || "Failed to load sale details.");
    }
  };

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

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text(`Invoice # ${saleDetails.saleInfo.invoice_id}`, 15, 20);

    doc.setFontSize(14);
    doc.text(`Client Name: ${saleDetails.saleInfo.name}`, 15, 30);
    doc.text(`Client Email: ${saleDetails.saleInfo.email}`, 15, 36);

    doc.text("Sale Details", 15, 45);
    doc.autoTable({
      head: [["Description", "Quantity", "Subtotal"]],
      body: saleDetails.saleDetails.map((item) => [item.stock_name, item.sale_stock, item.subtotal]),
      startY: 50,
    });

    const totalStartY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Net Price: ${saleDetails.saleInfo.net_price}`, 15, totalStartY);
    doc.text(`VAT Amount: ${saleDetails.saleInfo.vat_amount}`, 15, totalStartY + 6);
    doc.text(`Tax Amount: ${saleDetails.saleInfo.tax_amount}`, 15, totalStartY + 12);
    doc.text(`Total Amount: ${saleDetails.saleInfo.grand_total}`, 15, totalStartY + 18);

    doc.save(`Invoice_${saleDetails.saleInfo.invoice_id}.pdf`);
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
                        {/* View Button */}
                        <button type="button" onClick={() => handleViewClick(sale.id)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center">
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

        {isViewModalOpen && saleDetails && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg w-[700px]">
              {/* Invoice Header */}
              <h2 className="text-2xl font-bold mb-4 text-center">Invoice # {saleDetails.saleInfo.invoice_id}</h2>
              <div className="mt-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Client Info</h3>
                  <p>{saleDetails.saleInfo.name}</p>
                  <p>{saleDetails.saleInfo.email}</p>
                </div>
              </div>
              {/* Sale Details Table */}
              <div className="mt-4 overflow-y-auto" style={{ maxHeight: "400px" }}>
                <h3 className="text-lg font-semibold mb-2">Sale Details</h3>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-4 py-2 text-left">Description</th>
                        <th className="border px-4 py-2 text-left">Quantity</th>
                        <th className="border px-4 py-2 text-left">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {saleDetails.saleDetails.map((item, index) => (
                        <tr key={index}>
                          <td className="border px-4 py-2">{item.stock_name}</td>
                          <td className="border px-4 py-2">{item.sale_stock}</td>
                          <td className="border px-4 py-2">{item.subtotal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Invoice Totals */}
              <div className="mt-3 border-gray-300 pt-3">
                <p>
                  <strong>Net Price:</strong> {saleDetails.saleInfo.net_price}
                </p>
                <p>
                  <strong>VAT Amount:</strong> {saleDetails.saleInfo.vat_amount}
                </p>
                <p>
                  <strong>Tax Amount:</strong> {saleDetails.saleInfo.tax_amount}
                </p>
                <p className="font-bold">
                  <strong>Total Amount:</strong> {saleDetails.saleInfo.grand_total}
                </p>
              </div>
              {/* Download Button */}
              <div className="flex justify-end mt-4">
                <button onClick={handleDownloadInvoice} className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md flex items-center">
                  <FaDownload className="mr-2" />
                  Download Invoice
                </button>
                <button onClick={() => setIsViewModalOpen(false)} className="text-white bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md ml-4">
                  Close
                </button>
              </div>
            </div>
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