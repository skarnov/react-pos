import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AddCustomer from './pages/AddCustomer';
import AddProduct from './pages/AddProduct';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ManageProducts from './pages/ManageProducts';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Dashboard />} />
          <Route path='/add_product' element={<AddProduct />} />
          <Route path='/manage_products' element={<ManageProducts />} />
          <Route path='/add_customer' element={<AddCustomer />} />
        </Routes>
      </BrowserRouter>
    </>

  )
}

export default App;