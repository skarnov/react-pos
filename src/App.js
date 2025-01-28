import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CustomerPage from "./pages/CustomerPage";
import AddCustomer from "./pages/AddCustomer";
import CategoryPage from "./pages/CategoryPage";
import AddCategory from "./pages/AddCategory";
import ProductPage from "./pages/ProductPage";
import AddProduct from "./pages/AddProduct";


import StockPage from "./pages/StockPage";
import AddStock from "./pages/AddStock";



import SalePage from "./pages/SalePage";
import IncomePage from "./pages/IncomePage";
import ExpensePage from "./pages/ExpensePage";




import AccountingPage from "./pages/AccountingPage";
import Logout from "./pages/Logout";
import PrivateRoute from "./components/PrivateRoute";
import { ConfigProvider } from "./contexts/ConfigContext";
import "./index.css";

function App() {
  return (
    <ConfigProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<Logout />} />

          {/* Private Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <PrivateRoute>
                <CustomerPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-customer"
            element={
              <PrivateRoute>
                <AddCustomer />
              </PrivateRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <PrivateRoute>
                <CategoryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-category"
            element={
              <PrivateRoute>
                <AddCategory />
              </PrivateRoute>
            }
          />
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <ProductPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <PrivateRoute>
                <AddProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="/stocks"
            element={
              <PrivateRoute>
                <StockPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <PrivateRoute>
                <SalePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/accounting"
            element={
              <PrivateRoute>
                <AccountingPage />
              </PrivateRoute>
            }
          />

          {/* Fallback Route */}
          <Route
            path="*"
            element={
              <Navigate to="/login" />
            }
          />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;