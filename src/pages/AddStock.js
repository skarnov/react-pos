import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import FooterNav from '../components/FooterNav';
import NavBar from '../components/NavBar';
import AuthUser from '../components/AuthUser';

function AddStock() {
  const { http } = AuthUser();

  const [name, setName] = useState('');
  const [barcode, setBarcode] = useState('');
  const [sku, setSKU] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const [ButtonText, setButtonText] = useState('Save');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      http.post('/manageProduct')
        .then((res) => {
          setData(res.data);
        });
    }
    getData();
  }, []);

  const saveStock = () => {
    setButtonText('Processing..');
    http.post('/saveStock', { product: name, barcode: barcode, sku: sku, buy_price: buyPrice, sale_price: salePrice, quantity: quantity })
      .then(function () {
        setButtonText('Save');
        setSuccessMessage('Stock Saved!');
      })
      .catch(function (err) {
        setButtonText('Save');
        
console.warn(err);

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
            <h4 className='mt-4'>Add Stock</h4>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Form.Group className="mb-3">
              <Form.Label>Select Product</Form.Label>
              <Form.Select onChange={(e) => setName(e.target.value)}>
                <option value=''>Select One</option>
                {data.map((item) =>
                  <option value={item.id}>{item.name}</option>
                )}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Barcode</Form.Label>
              <Form.Control type="text" onChange={(e) => setBarcode(e.target.value)} placeholder="Enter Product Barcode" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock Keeping Unit / Batch Number</Form.Label>
              <Form.Control type="text" onChange={(e) => setSKU(e.target.value)} placeholder="Enter Product Batch Number" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Buy Price</Form.Label>
              <Form.Control type="decimal" onChange={(e) => setBuyPrice(e.target.value)} placeholder="Enter Product Buy Price" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sale Price</Form.Label>
              <Form.Control type="decimal" onChange={(e) => setSalePrice(e.target.value)} placeholder="Enter Product Sale Price" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" onChange={(e) => setQuantity(e.target.value)} placeholder="Enter Product Quantity" />
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
            <Button className='btn btn-sm' onClick={saveStock} variant="success" type="submit">
              {ButtonText}
            </Button>
          </Col>
        </Row>
        <FooterNav />
      </Container>
    </>
  );
}

export default AddStock;