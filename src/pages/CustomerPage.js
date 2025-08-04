import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { fetchCustomers, deleteCustomer, updateCustomer } from "../api/axios";
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaPlus, FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaTimes } from "react-icons/fa";

const CustomerPage = () => {
  // State management
  const [state, setState] = useState({
    customers: [],
    loading: true,
    error: "",
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
    cartTotal: 0,
    notification: null,
  });

  // Modal states
  const [modal, setModal] = useState({
    isEditOpen: false,
    isDeleteOpen: false,
    customerToDelete: null,
    customerToEdit: null,
  });

  // Form states
  const [form, setForm] = useState({
    name: "",
    email: "",
    status: "active",
  });

  // Show notification
  const showNotification = (message, type = "info") => {
    setState((prev) => ({ ...prev, notification: { message, type } }));
    setTimeout(() => {
      setState((prev) => ({ ...prev, notification: null }));
    }, 3000);
  };

  // Fetch customers
  useEffect(() => {
    const fetchCustomerData = async () => {
      setState((prev) => ({ ...prev, loading: true, error: "" }));

      try {
        const response = await fetchCustomers({
          page: state.currentPage,
          per_page: state.perPage,
        });

        setState((prev) => ({
          ...prev,
          customers: response.data || [],
          currentPage: response.current_page || 1,
          lastPage: response.last_page || 1,
          perPage: response.per_page || state.perPage,
          total: response.total || 0,
          loading: false,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err.message || "Failed to load customers.",
          loading: false,
        }));
        showNotification(err.message || "Failed to load customers.", "error");
      }
    };

    fetchCustomerData();
  }, [state.currentPage, state.perPage]);

  // Calculate cart total
  useEffect(() => {
    const calculateCartTotal = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      return cart.reduce((total, item) => total + parseFloat(item.sale_price.replace(/[^0-9.-]+/g, "")) * item.quantity, 0).toFixed(2);
    };

    setState((prev) => ({ ...prev, cartTotal: parseFloat(calculateCartTotal()) }));
  }, []);

  // Handlers
  const handleDeleteClick = (customer) => {
    setModal((prev) => ({
      ...prev,
      isDeleteOpen: true,
      customerToDelete: customer,
    }));
  };

  const handleDeleteCustomer = async () => {
    if (!modal.customerToDelete) return;

    try {
      await deleteCustomer(modal.customerToDelete.id);
      setState((prev) => ({
        ...prev,
        customers: prev.customers.filter((c) => c.id !== modal.customerToDelete.id),
        notification: {
          message: "Customer deleted successfully",
          type: "success",
        },
      }));
      setModal((prev) => ({ ...prev, isDeleteOpen: false }));
    } catch (err) {
      showNotification(err.message || "Error deleting customer", "error");
    }
  };

  const handleEditClick = (customer) => {
    setModal((prev) => ({
      ...prev,
      isEditOpen: true,
      customerToEdit: customer,
    }));
    setForm({
      name: customer.name,
      email: customer.email,
      status: customer.status,
    });
  };

  const handleEditSubmit = async () => {
    if (!form.name || !form.email || !form.status) {
      showNotification("Please fill all required fields", "warning");
      return;
    }

    try {
      const updatedCustomer = {
        ...modal.customerToEdit,
        ...form,
      };

      await updateCustomer(updatedCustomer);
      setState((prev) => ({
        ...prev,
        customers: prev.customers.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c)),
        notification: {
          message: "Customer updated successfully",
          type: "success",
        },
      }));
      setModal((prev) => ({ ...prev, isEditOpen: false }));
    } catch (err) {
      showNotification(err.message || "Error updating customer", "error");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (page) => {
    setState((prev) => ({ ...prev, currentPage: page }));
  };

  const handlePerPageChange = (e) => {
    setState((prev) => ({
      ...prev,
      perPage: parseInt(e.target.value),
      currentPage: 1,
    }));
  };

  // UI Components
  const StatusBadge = ({ status }) => <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;

  const Notification = () => {
    if (!state.notification) return null;

    const { message, type } = state.notification;
    const bgColor = {
      success: "bg-green-100 border-green-400 text-green-700",
      error: "bg-red-100 border-red-400 text-red-700",
      warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
      info: "bg-blue-100 border-blue-400 text-blue-700",
    }[type];

    const icon = {
      success: <FaCheckCircle className="text-green-500" />,
      error: <FaExclamationTriangle className="text-red-500" />,
      warning: <FaExclamationTriangle className="text-yellow-500" />,
      info: <FaInfoCircle className="text-blue-500" />,
    }[type];

    return (
      <div className={`fixed top-4 right-4 border-l-4 ${bgColor} p-4 rounded shadow-lg max-w-sm z-50 flex items-start`}>
        <div className="mr-3 mt-0.5">{icon}</div>
        <div className="flex-1">
          <p className="text-sm">{message}</p>
        </div>
        <button onClick={() => setState((prev) => ({ ...prev, notification: null }))} className="ml-4 text-gray-500 hover:text-gray-700">
          <FaTimes />
        </button>
      </div>
    );
  };

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
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{(state.currentPage - 1) * state.perPage + 1}</span> to <span className="font-medium">{Math.min(state.currentPage * state.perPage, state.total)}</span> of <span className="font-medium">{state.total}</span> customers
          </p>
        </div>
        <div className="flex-1 flex justify-between sm:justify-end">
          <button onClick={() => handlePageChange(state.currentPage - 1)} disabled={state.currentPage === 1} className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${state.currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"}`}>
            <FaChevronLeft className="h-3 w-3 mr-1" /> Previous
          </button>
          <div className="hidden sm:flex mx-2">
            {pageNumbers.map((page) => (
              <button key={page} onClick={() => handlePageChange(page)} className={`mx-1 px-3 py-1 border text-sm font-medium rounded-md ${page === state.currentPage ? "bg-blue-500 border-blue-500 text-white" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                {page}
              </button>
            ))}
          </div>
          <button onClick={() => handlePageChange(state.currentPage + 1)} disabled={state.currentPage === state.lastPage} className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${state.currentPage === state.lastPage ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"}`}>
            Next <FaChevronRight className="h-3 w-3 ml-1" />
          </button>
        </div>
      </div>
    );
  };

  const LoadingIndicator = () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  const ErrorMessage = ({ message }) => (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
      <div className="flex items-center">
        <FaExclamationTriangle className="text-red-500 mr-3" />
        <div>
          <p className="text-sm text-red-700">{message}</p>
        </div>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="mx-auto h-24 w-24 text-gray-400">
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 className="mt-2 text-lg font-medium text-gray-900">No customers found</h3>
      <p className="mt-1 text-sm text-gray-500">Get started by adding a new customer.</p>
      <div className="mt-6">
        <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <FaPlus className="-ml-1 mr-2 h-4 w-4" />
          Add Customer
        </button>
      </div>
    </div>
  );

  return (
    <Layout cartTotal={state.cartTotal}>
      <div className="min-h-screen bg-white py-4">
        <Notification />
        <div className="mx-auto p-4">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col">
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
                <p className="mt-1 text-sm text-gray-500">Manage your customer accounts and information</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {state.loading ? (
              <LoadingIndicator />
            ) : state.error ? (
              <ErrorMessage message={state.error} />
            ) : state.customers.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
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
                      {state.customers.map((customer) => (
                        <tr key={customer.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">{customer.name.charAt(0).toUpperCase()}</div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                <div className="text-xs text-gray-500">ID: {customer.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{customer.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={customer.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => handleEditClick(customer)} className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center">
                              <FaEdit className="mr-1" /> Edit
                            </button>
                            <button onClick={() => handleDeleteClick(customer)} className="text-red-600 hover:text-red-900 inline-flex items-center">
                              <FaTrash className="mr-1" /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination />
                <div className="flex items-center p-4">
                  <label htmlFor="perPage" className="mr-2 text-sm text-gray-600 whitespace-nowrap">
                    Show:
                  </label>
                  <select id="perPage" value={state.perPage} onChange={handlePerPageChange} className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    {[5, 10, 15, 20, 25].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {modal.isEditOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900">Edit Customer</h3>
                  <button onClick={() => setModal((prev) => ({ ...prev, isEditOpen: false }))} className="text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input id="edit-name" name="name" type="text" value={form.name} onChange={handleFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
                  </div>

                  <div>
                    <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input id="edit-email" name="email" type="email" value={form.email} onChange={handleFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
                  </div>

                  <div>
                    <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select id="edit-status" name="status" value={form.status} onChange={handleFormChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" required>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                <button type="button" onClick={() => setModal((prev) => ({ ...prev, isEditOpen: false }))} className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Cancel
                </button>
                <button type="button" onClick={handleEditSubmit} className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {modal.isDeleteOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <FaExclamationTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Delete customer</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete <span className="font-semibold">{modal.customerToDelete?.name}</span>? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                <button type="button" onClick={() => setModal((prev) => ({ ...prev, isDeleteOpen: false }))} className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Cancel
                </button>
                <button type="button" onClick={handleDeleteCustomer} className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
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

export default CustomerPage;
