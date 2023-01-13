import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import FooterNav from '../components/FooterNav';
import NavBar from '../components/NavBar';
import AuthUser from '../components/AuthUser';

function AddSale() {
  const { http } = AuthUser();

  const [stockData, setStockData] = useState([]);
  const [customerData, setCustomerData] = useState([]);

  const [stock, setStock] = useState('');
  const [barcode, setBarcode] = useState('');
  const [sku, setSKU] = useState('');
  const [customer, setCustomer] = useState('');

  const [discount, setDiscount] = useState('');
  const [paid, setPaid] = useState('');

  const [ButtonText, setButtonText] = useState('Confirm Sale');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getStockData();
    getCustomerData();
  }, []);

  const getStockData = async () => {
    http.post('/manageStock')
      .then((res) => {
        setStockData(res.data);
      });
  }

  const getCustomerData = async () => {
    http.post('/manageCustomer')
      .then((res) => {
        setCustomerData(res.data);
      });
  }

  const saveSale = () => {
    setButtonText('Processing..');
    http.post('/saveSale', {
      stock: stock,
      barcode: barcode,
      sku: sku,
      discount: discount,
      paid: paid,
      customer: customer
    })
      .then(function () {
        setButtonText('Confirmed Sale');
        setSuccessMessage('Stock Saved!');
      })
      .catch(function (err) {
        setButtonText('Confirm Sale');

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
            <h4 className='mt-4'>Sales</h4>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <Form.Group className="mb-3">
              <Form.Label>Select Stock</Form.Label>
              <Form.Select onChange={(e) => setStock(e.target.value)}>
                <option value=''>Select One</option>
                {stockData.map((item) =>
                  <option value={item.id} key={item.id}>{item.name}</option>
                )}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Barcode</Form.Label>
              <Form.Control type="text" onChange={(e) => setBarcode(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock Keeping Unit / Batch Number</Form.Label>
              <Form.Control type="text" onChange={(e) => setSKU(e.target.value)} />
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
              <Form.Select onChange={(e) => setCustomer(e.target.value)}>
                <option value=''>Anonymous Customer</option>
                {customerData.map((item) =>
                  <option value={item.id} key={item.id}>{item.name}</option>
                )}
              </Form.Select>
            </Form.Group>
            <p>Total Due:</p>
            <p>Total Price:</p>
            <Form.Group className="mb-3">
              <Form.Label>Discount</Form.Label>
              <Form.Control type="text" onChange={(e) => setDiscount(e.target.value)} />
            </Form.Group>
            <p>Grand Total:</p>
            <Form.Group className="mb-3">
              <Form.Label>Paid Amount</Form.Label>
              <Form.Control type="text" onChange={(e) => setPaid(e.target.value)} />
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
            <Button className='btn btn-sm' onClick={saveSale} variant="success" type="submit">
              {ButtonText}
            </Button>
          </Col>
        </Row>
        <FooterNav />
      </Container>
    </>
  );
}

export default AddSale;