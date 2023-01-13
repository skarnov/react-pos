import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import FooterNav from '../components/FooterNav';
import NavBar from '../components/NavBar';
import AuthUser from '../components/AuthUser';

function EditProduct() {
  const { http } = AuthUser();
  const [ButtonText, setButtonText] = useState('Update');

  const { id } = useParams();
  const [name, setName] = useState('');

  const [editData, setEditData] = useState('');

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    DataInfo();
  }, []);

  const DataInfo = async () => {
    http.post('/selectProduct/' + id)
      .then((res) => {
        setEditData(res.data);
      });
  }

  const handleDataUpdate = () => {
    setButtonText('Processing..');
    http.post('/updateProduct', { id: id, name: name ? name : editData.name} )
      .then(function (response) {
        setButtonText('Update');
        setSuccessMessage('Product Updated!');
      })
      .catch(function (err) {
        setButtonText('Update');

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
            <h4 className='mt-4'>Edit The Product</h4>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="hidden" value={editData.id} />
              <Form.Control type="text" defaultValue={editData.name} onChange={(e) => setName(e.target.value)} />
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
            <Button className='btn btn-sm' onClick={handleDataUpdate} variant="primary" type="submit">
              {ButtonText}
            </Button>
          </Col>
        </Row>
        <FooterNav />
      </Container>
    </>
  );
}

export default EditProduct;