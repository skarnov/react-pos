import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import FooterNav from '../components/FooterNav';
import NavBar from '../components/NavBar';
import AuthUser from '../components/AuthUser';

function AddProduct() {
  const { http } = AuthUser();
  const [name, setName] = useState('');
  const [ButtonText, setButtonText] = useState('Save');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const saveProduct = () => {
    setButtonText('Processing..');
    http.post('/saveProduct', { name: name })
      .then(function (response) {
        setButtonText('Save');
        setSuccessMessage('Product Saved!');
      })
      .catch(function (err) {
        setButtonText('Save');
        var validationErrors = JSON.stringify(err.response.data.errors);
        var validationErrorsArray = JSON.parse(validationErrors);

        for (var k in validationErrorsArray) {
          setErrorMessage(validationErrorsArray[k]);
        }
      })
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
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" onChange={(e) => setName(e.target.value)} placeholder="Enter Product Name" />
            </Form.Group>
            {errorMessage && (
              <Alert variant="danger">
                <Alert.Heading>{errorMessage}</Alert.Heading>
              </Alert>
            )}
            {successMessage && (
              <Alert variant="success">
                <Alert.Heading>{successMessage}</Alert.Heading>
              </Alert>
            )}
            <Button className='btn btn-sm' onClick={saveProduct} variant="success" type="submit">
              {ButtonText}
            </Button>
          </Col>
        </Row>
        <FooterNav />
      </Container>
    </>
  );
}

export default AddProduct;