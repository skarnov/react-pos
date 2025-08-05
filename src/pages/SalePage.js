import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { fetchSale, fetchSaleDetails, deleteSale } from "../api/axios";
import { FaFileInvoice, FaTrash, FaDownload, FaSearch, FaTimes, FaChevronLeft, FaChevronRight, FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useConfig } from "../contexts/ConfigContext";

const SalePage = () => {
  const { config } = useConfig();
  const [state, setState] = useState({
    sales: [],
    loading: true,
    error: "",
    notification: null,
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
    cartTotal: 0,
    searchQuery: "",
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    sale: null,
  });

  const [viewModal, setViewModal] = useState({
    isOpen: false,
    saleDetails: null,
  });

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setState((prev) => ({ ...prev, currentPage: 1 }));
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [state.searchQuery]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: "" }));

        const response = await fetchSale({
          page: state.currentPage,
          per_page: state.perPage,
          search: state.searchQuery,
        });

        setState((prev) => ({
          ...prev,
          sales: response.data?.data || [],
          currentPage: response.data?.current_page || 1,
          lastPage: response.data?.last_page || 1,
          total: response.data?.total || 0,
          loading: false,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err.message || "Failed to load sales",
          loading: false,
        }));
        showNotification(err.message || "Failed to load sales", "error");
      }
    };

    fetchData();
  }, [state.currentPage, state.perPage, state.searchQuery]);

  // Calculate cart total
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart
      .reduce((sum, item) => {
        return sum + parseFloat(item.sale_price.replace(/[^0-9.-]+/g, "")) * item.quantity;
      }, 0)
      .toFixed(2);
    setState((prev) => ({ ...prev, cartTotal: parseFloat(total) }));
  }, []);

  // Notification helper
  const showNotification = (message, type = "info") => {
    setState((prev) => ({ ...prev, notification: { message, type } }));
    setTimeout(() => setState((prev) => ({ ...prev, notification: null })), 3000);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Sale actions
  const handleViewClick = async (saleId) => {
    try {
      const data = await fetchSaleDetails(saleId);
      setViewModal({
        isOpen: true,
        saleDetails: data,
      });
    } catch (error) {
      showNotification(error.message || "Failed to load sale details", "error");
    }
  };

  const handleDeleteClick = (sale) => {
    setDeleteModal({ isOpen: true, sale });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.sale) return;
    try {
      await deleteSale(deleteModal.sale.id);
      setState((prev) => ({
        ...prev,
        sales: prev.sales.filter((sale) => sale.id !== deleteModal.sale.id),
      }));
      showNotification("Sale deleted successfully", "success");
      setDeleteModal({ isOpen: false, sale: null });
    } catch (err) {
      showNotification(err.message || "Failed to delete sale", "error");
    }
  };

  const handleDownloadInvoice = () => {
    if (!viewModal.saleDetails) return;
    
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`Invoice # ${viewModal.saleDetails.saleInfo.invoice_id}`, 15, 20);
    doc.setFontSize(14);
    doc.text(`Client Name: ${viewModal.saleDetails.saleInfo.name}`, 15, 30);
    doc.text(`Client Email: ${viewModal.saleDetails.saleInfo.email}`, 15, 36);
    doc.text("Sale Details", 15, 45);
    doc.autoTable({
      head: [["Description", "Quantity", "Subtotal"]],
      body: viewModal.saleDetails.saleDetails.map((item) => [item.stock_name, item.sale_stock, item.subtotal]),
      startY: 50,
    });
    const totalStartY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Net Price: ${viewModal.saleDetails.saleInfo.net_price}`, 15, totalStartY);
    doc.text(`VAT Amount: ${viewModal.saleDetails.saleInfo.vat_amount}`, 15, totalStartY + 6);
    doc.text(`Tax Amount: ${viewModal.saleDetails.saleInfo.tax_amount}`, 15, totalStartY + 12);
    doc.text(`Total Amount: ${viewModal.saleDetails.saleInfo.grand_total}`, 15, totalStartY + 18);
    doc.save(`Invoice_${viewModal.saleDetails.saleInfo.invoice_id}.pdf`);
  };

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
    setState((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  // UI Components
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
            <select 
              value={state.perPage} 
              onChange={handlePerPageChange} 
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {[5, 10, 15, 20, 25].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-600 hidden sm:block">
            Showing <span className="font-medium">{(state.currentPage - 1) * state.perPage + 1}</span> to{' '}
            <span className="font-medium">{Math.min(state.currentPage * state.perPage, state.total)}</span> of{' '}
            <span className="font-medium">{state.total}</span> items
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => handlePageChange(state.currentPage - 1)} 
            disabled={state.currentPage === 1} 
            className={`p-2 border rounded-md ${state.currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"}`}
          >
            <FaChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex gap-1">
            {pageNumbers.map((page) => (
              <button 
                key={page} 
                onClick={() => handlePageChange(page)} 
                className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-md ${page === state.currentPage ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`}
              >
                {page}
              </button>
            ))}
          </div>

          <button 
            onClick={() => handlePageChange(state.currentPage + 1)} 
            disabled={state.currentPage === state.lastPage} 
            className={`p-2 border rounded-md ${state.currentPage === state.lastPage ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"}`}
          >
            <FaChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <Layout cartTotal={state.cartTotal}>
      <div className="min-h-screen bg-white p-4 md:p-6">
        {/* Notification */}
        {state.notification && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center max-w-md ${state.notification.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : state.notification.type === "error" ? "bg-red-50 text-red-800 border border-red-200" : "bg-blue-50 text-blue-800 border border-blue-200"}`}>
            {state.notification.type === "success" ? <FaCheckCircle className="mr-3 flex-shrink-0" /> : state.notification.type === "error" ? <FaExclamationTriangle className="mr-3 flex-shrink-0" /> : <FaInfoCircle className="mr-3 flex-shrink-0" />}
            <span className="text-sm">{state.notification.message}</span>
            <button onClick={() => setState((prev) => ({ ...prev, notification: null }))} className="ml-4 text-gray-400 hover:text-gray-500">
              <FaTimes />
            </button>
          </div>
        )}

        {/* Page Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Sales History</h1>
            <p className="text-gray-600">View and manage your sales records</p>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search invoices..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full" 
              value={state.searchQuery} 
              onChange={handleSearchChange} 
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Total Sales</p>
            <p className="text-2xl font-bold">{state.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <p className="text-2xl font-bold">
              {config.currencySign}
              {state.sales.reduce((sum, sale) => sum + parseFloat(sale.grand_total), 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Average Sale</p>
            <p className="text-2xl font-bold">
              {config.currencySign}
              {state.sales.length > 0 
                ? (state.sales.reduce((sum, sale) => sum + parseFloat(sale.grand_total), 0) / state.sales.length).toFixed(2)
                : "0.00"}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Today's Sales</p>
            <p className="text-2xl font-bold">
              {state.sales.filter(sale => new Date(sale.created_at).toDateString() === new Date().toDateString()).length}
            </p>
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
              <FaExclamationTriangle className="mr-2" />
              {state.error}
            </div>
          ) : state.sales.length === 0 ? (
            <div className="text-center p-12">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <FaFileInvoice className="w-full h-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No sales found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or make a new sale</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {state.sales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-600">#{sale.invoice_id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{sale.customer_name || "Walk-in Customer"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(sale.created_at)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {config.currencySign}{sale.grand_total}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-4">
                            <button 
                              onClick={() => handleViewClick(sale.id)} 
                              className="text-blue-600 hover:text-blue-900 flex items-center"
                            >
                              <FaFileInvoice className="mr-1" /> View
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(sale)} 
                              className="text-red-600 hover:text-red-900 flex items-center"
                            >
                              <FaTrash className="mr-1" /> Delete
                            </button>
                          </div>
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

        {/* View Modal */}
        {viewModal.isOpen && viewModal.saleDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <FaFileInvoice className="text-blue-500 mr-2" />
                    Invoice #{viewModal.saleDetails.saleInfo.invoice_id}
                  </h2>
                  <button 
                    onClick={() => setViewModal({ isOpen: false, saleDetails: null })} 
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FaTimes className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Customer Information</h3>
                    <p className="text-sm text-gray-900">{viewModal.saleDetails.saleInfo.name || "Walk-in Customer"}</p>
                    {viewModal.saleDetails.saleInfo.email && (
                      <p className="text-sm text-gray-500">{viewModal.saleDetails.saleInfo.email}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Sale Information</h3>
                    <p className="text-sm text-gray-500">Date: {formatDate(viewModal.saleDetails.saleInfo.created_at)}</p>
                    <p className="text-sm text-gray-500">
                      Status: <span className="text-green-600">Completed</span>
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">Items</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {viewModal.saleDetails.saleDetails.map((item, index) => (
                          <tr key={index}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.stock_name}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.sale_stock}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {config.currencySign}
                              {item.price}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {config.currencySign}
                              {item.subtotal}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-500">Subtotal:</span>
                    <span className="text-sm text-gray-900">
                      {config.currencySign}
                      {viewModal.saleDetails.saleInfo.net_price}
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-500">VAT:</span>
                    <span className="text-sm text-gray-900">
                      {config.currencySign}
                      {viewModal.saleDetails.saleInfo.vat_amount}
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-500">Tax:</span>
                    <span className="text-sm text-gray-900">
                      {config.currencySign}
                      {viewModal.saleDetails.saleInfo.tax_amount}
                    </span>
                  </div>
                  <div className="flex justify-between mt-3 pt-3 border-t border-gray-200">
                    <span className="text-base font-bold text-gray-900">Total:</span>
                    <span className="text-base font-bold text-gray-900">
                      {config.currencySign}
                      {viewModal.saleDetails.saleInfo.grand_total}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setViewModal({ isOpen: false, saleDetails: null })}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadInvoice}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                  >
                    <FaDownload className="mr-2" />
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {deleteModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <FaExclamationTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Delete sale</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete invoice <span className="font-semibold">#{deleteModal.sale?.invoice_id}</span>? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteModal({ isOpen: false, sale: null })}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
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