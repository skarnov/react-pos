import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from "react-router-dom";
import AuthUser from './AuthUser';

function NavBar() {
    const { token, logout } = AuthUser();
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
                            </NavDropdown>
                            <NavDropdown title="Business Analysis" id="basic-nav-dropdown">
                                <NavDropdown.Item as={Link} to="/add_sale">Stock Report</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/add_sale">Stock Popularity</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/add_sale">Sales Analysis</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/add_sale">Income Growth</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/add_sale">Customer Ranking</NavDropdown.Item>
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
        </>
    )
}

export default NavBar;