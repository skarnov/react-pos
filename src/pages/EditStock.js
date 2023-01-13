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

function EditStock() {
  const { http } = AuthUser();

  const [barcode, setBarcode] = useState('');
  const [sku, setSKU] = useState('');
  const [quantity, setQuantity] = useState('');

  const [ButtonText, setButtonText] = useState('Update');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { id } = useParams();
  const [editData, setEditData] = useState('');

  useEffect(() => {
    const DataInfo = async () => {
      http.post('/selectStock/' + id)
        .then((res) => {
          setEditData(res.data);
        });
    }
    DataInfo();
  }, []);

  const handleDataUpdate = () => {
    setButtonText('Processing..');
    http.post('/updateStock', {
      id: id,
      barcode: barcode ? barcode : editData.barcode,
      sku: sku ? sku : editData.sku,
      quantity: quantity ? quantity : editData.quantity
    })
      .then(function (response) {
        setButtonText('Update');
        setSuccessMessage('Stock Updated!');
      })
      .catch(function (err) {
        setErrorMessage(err.response.data.msg);
        setButtonText('Update');
      })
  }

  return (
    <>
      <Container fluid>
        <NavBar />
        <Row className='mt-5'>
          <Col sm={12}>
            <h4 className='mt-4'>Edit The Stock</h4>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <Form.Group className="mb-3">
              <Form.Label>Barcode</Form.Label>
              <Form.Control type="hidden" value={editData.id} />
              <Form.Control type="text" defaultValue={editData.barcode} onChange={(e) => setBarcode(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock Keeping Unit / Batch Number</Form.Label>
              <Form.Control type="text" defaultValue={editData.sku} onChange={(e) => setSKU(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" defaultValue={editData.quantity} onChange={(e) => setQuantity(e.target.value)} />
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
          <Col sm={6} className='mt-4' style={{ lineHeight: '0.7rem' }}>
            <p>Stock: <span style={{ fontWeight: '600'}}>{editData.name}</span></p>
            <p style={{ textDecoration: 'underline'}}>Buy Price: <span style={{ fontWeight: '600'}}>{editData.buy_price}</span></p>
            <p>Sale Price: <span style={{ fontWeight: '600'}}>{editData.sale_price}</span></p>
          </Col>
        </Row>
        <FooterNav />
      </Container>
    </>
  );
}

export default EditStock;