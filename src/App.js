
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './App.css';


function App() {
  return (
    
    <Navbar bg='success' expand="lg">
      <Container>
        <Navbar.Brand href="#home">React POS</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">

            <NavDropdown title="Products" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Add Product</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.1">Product Management</NavDropdown.Item>
             
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

  );

}

export default App;
