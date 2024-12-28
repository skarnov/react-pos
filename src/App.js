import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CustomerPage from './pages/CustomerPage';
import ProductPage from './pages/ProductPage';
import StockPage from './pages/StockPage';
import SalePage from './pages/SalePage';
import AccountingPage from './pages/AccountingPage';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/customers" element={<CustomerPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/stocks" element={<StockPage />} />
        <Route path="/sales" element={<SalePage />} />
        <Route path="/accounting" element={<AccountingPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;