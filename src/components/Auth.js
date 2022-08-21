import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from "react-router-dom";
import AddCustomer from '../pages/AddCustomer';
import AddProduct from '../pages/AddProduct';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import ManageCustomers from '../pages/ManageCustomers';
import ManageProducts from '../pages/ManageProducts';
import SearchProduct from '../pages/SearchProduct';
import NavBar from './NavBar';

function Auth() {
    return (
        <>
            <NavBar />
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/add_product' element={<AddProduct />} />
                <Route path='/manage_products' element={<ManageProducts />} />
                <Route path='/search_product/:any' element={<SearchProduct />} />
                <Route path='/add_customer' element={<AddCustomer />} />
                <Route path='/manage_customers' element={<ManageCustomers />} />
            </Routes>
        </>
    );
}

export default Auth;