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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");

  useEffect(() => {
    const calculateCartTotal = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      return cart
        .reduce(
          (total, item) =>
            total +
            parseFloat(item.sale_price.replace(/[^0-9.-]+/g, "")) *
              item.quantity,
          0
        )
        .toFixed(2);
    };

    const total = parseFloat(calculateCartTotal());
    setCartTotal(total);
  }, []);

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

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;

    try {
      await deleteCustomer(customerToDelete.id);
      setCustomers((prev) =>
        prev.filter((customer) => customer.id !== customerToDelete.id)
      );
      alert("Customer deleted successfully.");
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Error deleting customer:", err.message);
      alert(err.message || "Failed to delete customer.");
    }
  };

  const handleEditClick = (customer) => {
    setCustomerToEdit(customer);
    setUpdatedName(customer.name);
    setUpdatedEmail(customer.email);
    setUpdatedStatus(customer.status);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!updatedName || !updatedEmail || !updatedStatus) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const updatedCustomer = {
        ...customerToEdit,
        name: updatedName,
        email: updatedEmail,
        status: updatedStatus,
      };

      await updateCustomer(updatedCustomer);
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === updatedCustomer.id ? updatedCustomer : customer
        )
      );

      alert("Customer updated successfully.");
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error updating customer:", err.message);
      alert(err.message || "Failed to update customer.");
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout cartTotal={cartTotal}>
      <div className="min-h-screen bg-gray-100 p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Customers</h2>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

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
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-100">
                      <td className="py-3 px-4">{customer.name}</td>
                      <td className="py-3 px-4">{customer.email}</td>
                      <td className="py-3 px-4 capitalize">{customer.status}</td>
                      <td className="py-3 px-4 flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEditClick(customer)}
                          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 flex items-center"
                        >
                          <FaEdit className="mr-2" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(customer)}
                          className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 flex items-center"
                        >
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
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-6">Edit Customer</h2>

            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
                className="w-full p-3 border rounded-md mt-2"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={updatedEmail}
                onChange={(e) => setUpdatedEmail(e.target.value)}
                className="w-full p-3 border rounded-md mt-2"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="status" className="block text-gray-700">
                Status
              </label>
              <select
                id="status"
                value={updatedStatus}
                onChange={(e) => setUpdatedStatus(e.target.value)}
                className="w-full p-3 border rounded-md mt-2"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <hr className="my-3 border-t border-gray-300" />

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-6">Delete Customer</h2>
            <p>Are you sure you want to delete this customer?</p>

            <hr className="my-3 border-t border-gray-300" />

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCustomer}
                className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CustomerPage;