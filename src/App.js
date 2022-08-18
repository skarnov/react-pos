import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AddCustomer from './pages/AddCustomer';
import AddProduct from './pages/AddProduct';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ManageCustomers from './pages/ManageCustomers';
import ManageProducts from './pages/ManageProducts';
import SearchProduct from './pages/SearchProduct';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Dashboard />} />
          <Route path='/add_product' element={<AddProduct />} />
          <Route path='/manage_products' element={<ManageProducts />} />
          <Route path='/search_product/:any' element={<SearchProduct />} />
          <Route path='/add_customer' element={<AddCustomer />} />
          <Route path='/manage_customers' element={<ManageCustomers />} />
        </Routes>
      </BrowserRouter>
    </>

  )
}

export default App;