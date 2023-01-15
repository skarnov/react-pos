import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import NavBar from '../components/NavBar';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import FooterNav from '../components/FooterNav';
import AuthUser from '../components/AuthUser';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddSale() {
  const { http } = AuthUser();
  const [stockData, setStockData] = useState([]);
  const [customerData, setCustomerData] = useState([]);

  const toastOptions = {
    autoClose: 400,
    pauseOnHover: true,
  }

  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const addProductToCart = async (stockId) => {
      http.post('/selectStock/' + stockId)
        .then((res) => {
          if (res.data.quantity >= 1) {
            let addingProduct = {
              'id': res.data.id,
              'name': res.data.name,
              'quantity': 1,
              'price': res.data.sale_price,
              'subtotal': res.data.sale_price * 12
            }
            setCart([...cart, addingProduct]);
          } else {
            console.warn('NO cart');
          }
        });
  }

  const removeProduct = async (stockId) => {
    console.warn(stockId);
    toast(`${stockId}`, toastOptions)
  }

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


  // useEffect(() => {
  //   let newTotalAmount = 0;
  //   cart.forEach(icart => {
  //     newTotalAmount = cart[0].subtotal + parseInt(icart.price);
  //   })
  //   setTotalAmount(newTotalAmount);
  // },[cart])




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
              <Form.Select onChange={(e) => addProductToCart(e.target.value)}>
                <option>Select One</option>
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
                  <th width="55%">Stock Name</th>
                  <th width="10%">Quantity</th>
                  <th width="10%">Unit</th>
                  <th width="15%">Subtotal</th>
                  <th className="text-end" width="10%">Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.length ? cart.map((cartProduct, key) =>
                  <tr key={key}>
                    <td>{cartProduct.name}</td>
                    <td>{cartProduct.quantity}</td>
                    <td>{cartProduct.price}</td>
                    <td>{cartProduct.subtotal}</td>
                    <td className="text-end">
                      <button className='btn btn-danger btn-sm' onClick={() => removeProduct(cartProduct.id)}>Remove</button>
                    </td>
                  </tr>)
                  : 'No Items in Cart'}
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
            <p>Total Price: {totalAmount}</p>
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
          <ToastContainer />
        </Row>
        <FooterNav />
      </Container>
    </>
  );
}

export default AddSale;