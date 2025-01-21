import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { fetchCustomers, deleteCustomer, updateCustomer } from "../api/axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartTotal, setCartTotal] = useState(0);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");

  // Calculate the cart total from localStorage
  useEffect(() => {
    const calculateCartTotal = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      return cart.reduce((total, item) => total + parseFloat(item.sale_price.replace(/[^0-9.-]+/g, "")) * item.quantity, 0).toFixed(2);
    };

    const total = parseFloat(calculateCartTotal());
    setCartTotal(total);
  }, []);

  // Fetch customer data from API
  useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetchCustomers();
        setCustomers(response.data.customers || []);
      } catch (err) {
        console.error("Error fetching customers:", err.message);
        setError(err.message || "Failed to load customers.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  // Handle delete confirmation
  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomer(customerId);
        setCustomers((prev) => prev.filter((customer) => customer.id !== customerId));
        alert("Customer deleted successfully.");
      } catch (err) {
        console.error("Error deleting customer:", err.message);
        alert(err.message || "Failed to delete customer.");
      }
    }
  };

  // Handle edit modal open
  const handleEditClick = (customer) => {
    setCustomerToEdit(customer);
    setUpdatedName(customer.name);
    setUpdatedEmail(customer.email);
    setIsEditModalOpen(true);
  };

  // Handle form submission to update customer
  const handleEditSubmit = async () => {
    if (!updatedName || !updatedEmail) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      const updatedCustomer = {
        ...customerToEdit,
        name: updatedName,
        email: updatedEmail,
      };

      await updateCustomer(updatedCustomer);
      setCustomers((prev) => prev.map((customer) => (customer.id === updatedCustomer.id ? updatedCustomer : customer)));

      alert("Customer updated successfully.");
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error updating customer:", err.message);
      alert(err.message || "Failed to update customer.");
    }
  };

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) => customer.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Layout cartTotal={cartTotal}>
      <div className="min-h-screen bg-gray-100 p-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Customers</h2>

        {/* Search Bar */}
        <div className="mb-6">
          <input type="text" placeholder="Search customers..." className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-600" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {/* Customer List */}
        {loading ? (
          <p>Loading customers...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {filteredCustomers.length === 0 ? (
              <p className="p-6 text-gray-600">No customers found.</p>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-100">
                      <td className="py-3 px-4">{customer.name}</td>
                      <td className="py-3 px-4">{customer.email}</td>
                      <td className="py-3 px-4">
                        {/* Edit Button */}
                        <button type="button" onClick={() => handleEditClick(customer)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                          <FaEdit className="inline mr-2" />
                          Edit
                        </button>

                        {/* Delete Button */}
                        <button type="button" onClick={() => handleDeleteCustomer(customer.id)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                          <FaTrash className="inline mr-2" />
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
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-6">Edit Customer</h2>

            {/* Form Fields */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700">
                Name
              </label>
              <input id="name" type="text" value={updatedName} onChange={(e) => setUpdatedName(e.target.value)} className="w-full p-3 border rounded-md mt-2" />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input id="email" type="email" value={updatedEmail} onChange={(e) => setUpdatedEmail(e.target.value)} className="w-full p-3 border rounded-md mt-2" />
            </div>

            {/* Horizontal Bar */}
            <hr className="my-6 border-t border-gray-300" />

            {/* Buttons */}
            <div className="flex justify-end space-x-4">
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-md">
                Cancel
              </button>
              <button onClick={handleEditSubmit} className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CustomerPage;