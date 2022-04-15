import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Row from 'react-bootstrap/Row';

function Dashboard() {
    return (

        <>
            <Navbar fixed="top" bg='dark' variant='dark' expand="lg">
                <Container>
                    <Navbar.Brand href="#home">React POS</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">


                            <NavDropdown title="Products" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Add Product</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.1">Product Management</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Stock" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Add Stock</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.1">Stock Management</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Customers" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Add Customer</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.1">Customer Management</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Sales" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">New Sale</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.1">Sales Management</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Profile" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Edit Profile</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Logout</NavDropdown.Item>
                            </NavDropdown>


                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container fluid>

                <Row className='mt-5'>
                    <Col sm={12}>
                        <h3 className='mt-4'>Dashboard</h3>
                        <hr />
                    </Col>
                </Row>

                <Navbar fixed="bottom">
                    <Container>
                        <Navbar.Collapse className="justify-content-end">
                            <Navbar.Text>
                                &copy; <a href="https://evistechnology.com/">Evis Technology</a> All Rights Reserved.
                            </Navbar.Text>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>



            </Container>

        </>




    )
}

export default Dashboard;