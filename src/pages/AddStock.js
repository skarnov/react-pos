import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import FooterNav from './FooterNav';
import NavBar from './NavBar';

function AddStock() {
  const [name, setName] = useState('');

  async function saveProduct() {
    const formData = new FormData();

    formData.append('name', name);
    let result = await fetch("http://localhost/laravel-pos/public/api/saveProduct", {
      method: 'POST',
      body: formData

    });
    alert('Save The Product');
  }

  return (
    <>
      <Container fluid>
        <NavBar />
        <Row className='mt-5'>
          <Col sm={12}>
            <h4 className='mt-4'>Add Product</h4>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control type="text" onChange={(e) => setName(e.target.value)} placeholder="Enter Product Name" />
            </Form.Group>
            <Button className='btn btn-sm' onClick={saveProduct} variant="success" type="submit">
              Save
            </Button>
          </Col>
        </Row>
        <FooterNav />
      </Container>
    </>
  );
}

export default AddStock;