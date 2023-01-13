import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from "react-router-dom";

import Login from '../pages/Login';
import NavBar from './NavBar';
import Dashboard from '../pages/Dashboard';

import AddProduct from '../pages/AddProduct';
import ManageProducts from '../pages/ManageProducts';
import EditProduct from '../pages/EditProduct';

import AddStock from '../pages/AddStock';
import ManageStocks from '../pages/ManageStocks';
import EditStock from '../pages/EditStock';

import AddCustomer from '../pages/AddCustomer';
import ManageCustomers from '../pages/ManageCustomers';
import EditCustomer from '../pages/EditCustomer';

import AddSale from '../pages/AddSale';
import ManageSales from '../pages/ManageSales';

function Auth() {
    return (
        <>
            <NavBar />
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/dashboard' element={<Dashboard />} />
                
                <Route path='/add_product' element={<AddProduct />} />
                <Route path='/manage_products' element={<ManageProducts />} />
                <Route path='/edit_product/:id' element={<EditProduct />} />

                <Route path='/add_stock' element={<AddStock />} />
                <Route path='/manage_stocks' element={<ManageStocks />} />
                <Route path='/edit_stock/:id' element={<EditStock />} />

                <Route path='/add_customer' element={<AddCustomer />} />
                <Route path='/manage_customers' element={<ManageCustomers />} />
                <Route path='/edit_customer/:id' element={<EditCustomer />} />

                <Route path='/add_sale' element={<AddSale />} />
                <Route path='/manage_sales' element={<ManageSales />} />
            </Routes>
        </>
    );
}

export default Auth;