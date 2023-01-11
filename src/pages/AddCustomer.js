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

function AddCustomer() {
  const { http } = AuthUser();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');

  const [ButtonText, setButtonText] = useState('Save');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const saveCustomer = () => {
    setButtonText('Processing..');
    http.post('/saveCustomer', { name: name, mobile: mobile })
      .then(function (response) {
        setButtonText('Save');
        setSuccessMessage('Customer Saved!');
      })
      .catch(function (err) {
        setButtonText('Save');
        var validationErrors = JSON.stringify(err.response.data.errors);
        var validationErrorsArray = JSON.parse(validationErrors);

        let errors = "";
        for (let x in validationErrorsArray) {
          errors += validationErrorsArray[x] + ' ';
        }
        setErrorMessage(errors);
      })
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
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control type="text" onChange={(e) => setMobile(e.target.value)} placeholder="Enter Mobile Number" />
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
            <Button className='btn btn-sm' onClick={saveCustomer} variant="success" type="submit">
              {ButtonText}
            </Button>
          </Col>
        </Row>
        <FooterNav />
      </Container>
    </>
  );
}

export default AddCustomer;