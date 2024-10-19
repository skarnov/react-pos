import { Container, Navbar } from 'react-bootstrap';

function FooterNav() {
  return (
    <Navbar bg="light" className="footer-nav mt-4 py-3">
      <Container className="d-flex justify-content-center">
        <Navbar.Text className="text-center">
          &copy; {new Date().getFullYear()} <a href="https://obydullah.com/" target="_blank" rel="noopener noreferrer">Obydullah</a> - All Rights Reserved.
        </Navbar.Text>
      </Container>
    </Navbar>
  );
}

export default FooterNav;