import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { fetchProducts, fetchCategories, deleteProduct, updateProduct } from "../api/axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const ProductPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    status: "active",
    sku: "",
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartTotal, setCartTotal] = useState(0);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);

  const [updatedName, setUpdatedName] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updatedCategory, setUpdatedCategory] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  const [updatedSKU, setUpdatedSKU] = useState("");
  const [updatedBarcode, setUpdatedBarcode] = useState("");
  const [updatedSpecification, setUpdatedSpecification] = useState("");
  const [updatedImage, setUpdatedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUpdatedImage(file);
  };

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

  // Calculate the cart total from localStorage
  useEffect(() => {
    const calculateCartTotal = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      return cart.reduce((total, item) => total + parseFloat(item.sale_price.replace(/[^0-9.-]+/g, "")) * item.quantity, 0).toFixed(2);
    };

    const total = parseFloat(calculateCartTotal());
    setCartTotal(total);
  }, []);

  // Fetch product data from API
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetchProducts();
        setProducts(response.data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err.message);
        setError(err.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, []);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id);
      setProducts((prev) => prev.filter((product) => product.id !== productToDelete.id));
      alert("Product deleted successfully.");
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Error deleting product:", err.message);
      alert(err.message || "Failed to delete product.");
    }
  };

  const handleEditClick = (product) => {
    console.log(product);

    setProductToEdit(product);
    setUpdatedName(product.name);
    setUpdatedStatus(product.status);
    setUpdatedDescription(product.description);
    setUpdatedSKU(product.sku);
    setUpdatedBarcode(product.barcode);
    setUpdatedSpecification(product.specification);
    setUpdatedCategory(product.fk_category_id);
    setUpdatedImage(null);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!updatedName || !updatedCategory || !updatedDescription || !updatedStatus) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const updatedProduct = {
        ...productToEdit,
        name: updatedName,
        category_id: formData.category_id,
        description: updatedDescription,
        status: updatedStatus,
        image: updatedImage,
      };

      await updateProduct(updatedProduct);
      setProducts((prev) => prev.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)));

      alert("Product updated successfully.");
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error updating product:", err.message);
      alert(err.message || "Failed to update product.");
    }
  };

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Layout cartTotal={cartTotal}>
      <div className="min-h-screen bg-gray-100 p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Products</h2>

        {/* Search Bar */}
        <div className="mb-6">
          <input type="text" placeholder="Search products..." className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-600" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {/* Product List */}
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {filteredProducts.length === 0 ? (
              <p className="p-6 text-gray-600">No products found.</p>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-3 px-4">Image</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Category Name</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-100">
                      <td className="py-3 px-4">
                        <img src={`http://127.0.0.1:8000/uploads/${product.image}`} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                      </td>
                      <td className="py-3 px-4">{product.name}</td>
                      <td className="py-3 px-4">{product.category_name}</td>
                      <td className="py-3 px-4 capitalize">{product.status}</td>
                      <td className="py-3 px-4 flex items-center space-x-2">
                        {/* Edit Button */}
                        <button type="button" onClick={() => handleEditClick(product)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center">
                          <FaEdit className="mr-2" />
                          Edit
                        </button>
                        {/* Delete Button */}
                        <button type="button" onClick={() => handleDeleteClick(product)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 flex items-center">
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
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg w-[60rem]">
              <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
              {/* Horizontal Bar */}
              <hr className="my-6 border-t border-gray-300" />

              {/* Form Layout */}
              <form className="grid grid-cols-2 gap-6">
                {/* Column 1 */}
                <div className="space-y-4">
                  {/* Image Field */}
                  <div className="mb-4 flex flex-col items-center">
                    <label htmlFor="image" className="block text-gray-700">
                      Product Image
                    </label>
                    <img src={updatedImage ? URL.createObjectURL(updatedImage) : `http://127.0.0.1:8000/uploads/${productToEdit?.image}`} alt={productToEdit?.name} className="w-24 h-24 object-cover rounded-md mb-3" />
                    <input id="image" type="file" className="p-2 border rounded-md" onChange={handleImageChange} />
                  </div>

                  {/* Name Field */}
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700">
                      Name
                    </label>
                    <input id="name" type="text" value={updatedName} onChange={(e) => setUpdatedName(e.target.value)} className="w-full p-3 border rounded-md mt-2" />
                  </div>

                  {/* SKU Field */}
                  <div className="mb-4">
                    <label htmlFor="sku" className="block text-gray-700">
                      SKU
                    </label>
                    <input id="sku" type="text" value={updatedSKU} onChange={(e) => setUpdatedSKU(e.target.value)} className="w-full p-3 border rounded-md mt-2" />
                  </div>

                  {/* Barcode Field */}
                  <div className="mb-4">
                    <label htmlFor="barcode" className="block text-gray-700">
                      Barcode
                    </label>
                    <input id="barcode" type="text" value={updatedBarcode} onChange={(e) => setUpdatedBarcode(e.target.value)} className="w-full p-3 border rounded-md mt-2" />
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                  <div className="mb-4">
                    <label className="block font-medium mb-2">Category</label>
                    <select name="category_id" value={updatedCategory || ""} onChange={(e) => setUpdatedCategory(e.target.value)} className="w-full border px-4 py-2 rounded-lg" disabled={loading}>
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Specification Field */}
                  <div className="mb-4">
                    <label htmlFor="specification" className="block text-gray-700">
                      Specification
                    </label>
                    <textarea id="specification" value={updatedSpecification} onChange={(e) => setUpdatedSpecification(e.target.value)} className="w-full p-3 border rounded-md mt-2" />
                  </div>

                  {/* Description Field */}
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700">
                      Description
                    </label>
                    <textarea id="description" value={updatedDescription} onChange={(e) => setUpdatedDescription(e.target.value)} className="w-full p-3 border rounded-md mt-2" />
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
                </div>
              </form>

              {/* Horizontal Bar */}
              <hr className="my-6 border-t border-gray-300" />

              {/* Buttons */}
              <div className="flex justify-end space-x-4">
                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-md">
                  Cancel
                </button>
                <button type="submit" className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">
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
              <h2 className="text-2xl font-bold mb-6">Delete Product</h2>
              <p>Are you sure you want to delete this product?</p>

              {/* Horizontal Bar */}
              <hr className="my-3 border-t border-gray-300" />

              {/* Buttons */}
              <div className="flex justify-end space-x-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-md">
                  Cancel
                </button>
                <button onClick={handleDeleteProduct} className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md">
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

export default ProductPage;
