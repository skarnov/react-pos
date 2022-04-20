import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AddProduct from './pages/AddProduct';
import Dashboard from './pages/Dashboard';
import ManageProducts from './pages/ManageProducts';

function App() {
  return (

    <>

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/add_product' element={<AddProduct />} />
          <Route path='/manage_products' element={<ManageProducts />} />
        </Routes>
      </BrowserRouter>

    </>

  )
}

export default App;