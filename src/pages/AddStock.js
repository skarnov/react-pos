import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import FooterNav from '../components/FooterNav';
import NavBar from '../components/NavBar';

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
            <h4 className='mt-4'>Add Stock</h4>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>

            <Form.Group className="mb-3">
              <Form.Label>Select Product</Form.Label>
              <Form.Control type="text" onChange={(e) => setName(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Barcode</Form.Label>
              <Form.Control type="text" onChange={(e) => setName(e.target.value)} placeholder="Product Barcode" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Batch Number</Form.Label>
              <Form.Control type="text" onChange={(e) => setName(e.target.value)} placeholder="Product Batch Number" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Buy Price</Form.Label>
              <Form.Control type="decimal" onChange={(e) => setName(e.target.value)} placeholder="Product Buy Price" />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Sale Price</Form.Label>
              <Form.Control type="decimal" onChange={(e) => setName(e.target.value)} placeholder="Product Sale Price" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="decimal" onChange={(e) => setName(e.target.value)} placeholder="Product Quantity" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="date" onChange={(e) => setName(e.target.value)} placeholder="Stock Entry Date" />
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