import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from "react-router-dom";

import AddProduct from '../pages/AddProduct';
import ManageProducts from '../pages/ManageProducts';
import EditProduct from '../pages/EditProduct';

import AddCustomer from '../pages/AddCustomer';

import AddSale from '../pages/AddSale';
import AddStock from '../pages/AddStock';
import Dashboard from '../pages/Dashboard';
import FilterCustomers from '../pages/FilterCustomers';
import FilterSales from '../pages/FilterSales';
import FilterStocks from '../pages/FilterStocks';
import Login from '../pages/Login';
import ManageCustomers from '../pages/ManageCustomers';

import ManageSales from '../pages/ManageSales';
import ManageStocks from '../pages/ManageStocks';
import NavBar from './NavBar';

function Auth() {
    return (
        <>
            <NavBar />
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/add_product' element={<AddProduct />} />
                <Route path='/edit_product/:id' element={<EditProduct />} />


                <Route path='/manage_products' element={<ManageProducts />} />
                <Route path='/add_stock' element={<AddStock />} />
                <Route path='/manage_stocks' element={<ManageStocks />} />
                <Route path='/filter_stocks' element={<FilterStocks />} />
                <Route path='/add_sale' element={<AddSale />} />
                <Route path='/manage_sales' element={<ManageSales />} />
                <Route path='/filter_sales' element={<FilterSales />} />
                <Route path='/add_customer' element={<AddCustomer />} />
                <Route path='/manage_customers' element={<ManageCustomers />} />
                <Route path='/filter_customers' element={<FilterCustomers />} />
            </Routes>
        </>
    );
}

export default Auth;