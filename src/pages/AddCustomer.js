import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import FooterNav from '../components/FooterNav';
import NavBar from '../components/NavBar';

function AddCustomer() {
  const [name, setName] = useState('');
  const [file, setFile] = useState('');

  async function saveCustomer() {
    const formData = new FormData();

    formData.append('name', name);
    formData.append('file', file);
    
    let result = await fetch("http://localhost/laravel-pos/public/api/saveCustomer", {
      method: 'POST',
      body: formData

    });


    
    alert('Save The Customer');
  }

  return (
    <>
      <Container fluid>
        <NavBar />
        <Row className='mt-5'>
          <Col sm={12}>
            <h4 className='mt-4'>Add Customer</h4>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            
            <Form.Group className="mb-3">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control type="text" onChange={(e) => setName(e.target.value)} placeholder="Enter Customer Name" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} />
            </Form.Group>

            <Button className='btn btn-sm' onClick={saveCustomer} variant="success" type="submit">
              Save
            </Button>
          </Col>
        </Row>
        <FooterNav />
      </Container>
    </>
  );
}

export default AddCustomer;