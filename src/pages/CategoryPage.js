import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { fetchCategories, deleteCategory, updateCategory } from "../api/axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartTotal, setCartTotal] = useState(0);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  // Calculate the cart total from localStorage
  useEffect(() => {
    const calculateCartTotal = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      return cart.reduce((total, item) => total + parseFloat(item.sale_price.replace(/[^0-9.-]+/g, "")) * item.quantity, 0).toFixed(2);
    };

    const total = parseFloat(calculateCartTotal());
    setCartTotal(total);
  }, []);

  // Fetch category data from API
  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetchCategories();
        setCategories(response.data.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err.message);
        setError(err.message || "Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.id);
      setCategories((prev) => prev.filter((category) => category.id !== categoryToDelete.id));
      alert("Category deleted successfully.");
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Error deleting category:", err.message);
      alert(err.message || "Failed to delete category.");
    }
  };

  const handleEditClick = (category) => {
    setCategoryToEdit(category);
    setUpdatedName(category.name);
    setUpdatedStatus(category.status);
    setIsEditModalOpen(true);
  };

  const [updatedStatus, setUpdatedStatus] = useState("");

  const handleEditSubmit = async () => {
    if (!updatedName || !updatedStatus) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const updatedCategory = {
        ...categoryToEdit,
        name: updatedName,
        status: updatedStatus,
      };

      await updateCategory(updatedCategory);
      setCategories((prev) => prev.map((category) => (category.id === updatedCategory.id ? updatedCategory : category)));

      alert("Category updated successfully.");
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error updating category:", err.message);
      alert(err.message || "Failed to update category.");
    }
  };

  const filteredCategories = categories.filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Layout cartTotal={cartTotal}>
      <div className="min-h-screen bg-gray-100 p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Categories</h2>

        {/* Search Bar */}
        <div className="mb-6">
          <input type="text" placeholder="Search categories..." className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-600" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {/* Category List */}
        {loading ? (
          <p>Loading categories...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {filteredCategories.length === 0 ? (
              <p className="p-6 text-gray-600">No categories found.</p>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-100">
                      <td className="py-3 px-4">{category.name}</td>
                      <td className="py-3 px-4 capitalize">{category.status}</td>
                      <td className="py-3 px-4 flex items-center space-x-2">
                        {/* Edit Button */}
                        <button type="button" onClick={() => handleEditClick(category)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center">
                          <FaEdit className="mr-2" />
                          Edit
                        </button>
                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(category)} // Open delete modal
                          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 flex items-center"
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

      {/* Edit Modal */}

      {isEditModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-6">Edit Category</h2>

            {/* Name Field */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700">
                Name
              </label>
              <input id="name" type="text" value={updatedName} onChange={(e) => setUpdatedName(e.target.value)} className="w-full p-3 border rounded-md mt-2" />
            </div>

            {/* Status Dropdown */}
            <div className="mb-4">
              <label htmlFor="status" className="block text-gray-700">
                Status
              </label>
              <select id="status" value={updatedStatus} onChange={(e) => setUpdatedStatus(e.target.value)} className="w-full p-3 border rounded-md mt-2">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Horizontal Bar */}
            <hr className="my-3 border-t border-gray-300" />

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

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-6">Delete Category</h2>
            <p>Are you sure you want to delete this category?</p>

            {/* Horizontal Bar */}
            <hr className="my-3 border-t border-gray-300" />

            {/* Buttons */}
            <div className="flex justify-end space-x-4">
              <button onClick={() => setIsDeleteModalOpen(false)} className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-md">
                Cancel
              </button>
              <button onClick={handleDeleteCategory} className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CategoryPage;
