import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, Route, Routes } from "react-router-dom";
import AddCustomer from '../pages/AddCustomer';
import AddProduct from '../pages/AddProduct';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import ManageCustomers from '../pages/ManageCustomers';
import ManageProducts from '../pages/ManageProducts';
import SearchProduct from '../pages/SearchProduct';
import AuthUser from './AuthUser';

function Auth() {
    const { getToken, token, logout } = AuthUser();
    const logoutUser = () => {
        if (token != undefined) {
            logout();
        }
    }

    return (
        <>
            <Navbar fixed="top" bg='dark' variant='dark' expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to="/">React POS</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <NavDropdown title="Products" id="basic-nav-dropdown">
                                <NavDropdown.Item as={Link} to="/add_product">Add Product</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/manage_products">Product Management</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Stock" id="basic-nav-dropdown">
                                <NavDropdown.Item as={Link} to="/add_stock">Add Stock</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/manage_stocks">Stock Management</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Customers" id="basic-nav-dropdown">
                                <NavDropdown.Item as={Link} to="/add_customer">Add Customer</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/manage_customers">Customer Management</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Sales" id="basic-nav-dropdown">
                                <NavDropdown.Item as={Link} to="/add_sale">New Sale</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/manage_sales">Sales Management</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/sales_report">Monthly Sales Report</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Profile" id="basic-nav-dropdown">
                                <NavDropdown.Item as={Link} to="/edit_user">Edit Profile</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item as={Link} to="/logout" onClick={logoutUser}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
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