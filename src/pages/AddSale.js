import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import FooterNav from '../components/FooterNav';
import NavBar from '../components/NavBar';

function AddSale() {
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
            <h4 className='mt-4'>Sales</h4>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <Form.Group className="mb-3">
              <Form.Label>Select Stock</Form.Label>
              <Form.Select>
                <option>Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Barcode</Form.Label>
              <Form.Control type="text" onChange={(e) => setName(e.target.value)} placeholder="Enter Product Barcode" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock Keeping Unit / Batch Number</Form.Label>
              <Form.Control type="text" onChange={(e) => setName(e.target.value)} placeholder="Enter Product Batch Number" />
            </Form.Group>
          </Col>
          <Col sm={8}>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Stock Name</th>
                  <th>Sale Quantity</th>
                  <th>Unit Price</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>

        <Row>
          <Col sm={8}>

          </Col>
          <Col sm={4}>

            <Form.Group className="mb-3">
              <Form.Label>Select Customer</Form.Label>
              <Form.Select>
                <option>Anonymous Customer</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </Form.Select>
            </Form.Group>

            <p>Total Due:</p>
            <p>Total Price:</p>
            
            <Form.Group className="mb-3">
              <Form.Label>Discount</Form.Label>
              <Form.Control type="text" onChange={(e) => setName(e.target.value)} placeholder="Enter Discount Amount" />
            </Form.Group>


            <p>Grand Total:</p>
            <Form.Group className="mb-3">
              <Form.Label>Paid Amount</Form.Label>
              <Form.Control type="text" onChange={(e) => setName(e.target.value)} placeholder="Enter Paid Amount" />
            </Form.Group>
            <Button className='btn btn-sm' onClick={saveProduct} variant="success" type="submit">
              Confirm Sale
            </Button>
          </Col>








        </Row>


        <FooterNav />
      </Container>
    </>
  );
}

export default AddSale;