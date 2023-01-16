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
  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paidBox, setPaidBox] = useState(false);
  const [paid, setPaid] = useState(0);

  let [cart, setCart] = useState(
    JSON.parse(localStorage.getItem('cart')) || []
  );

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addProductToCart = async (stockId) => {
    setLoading(true);
    http.post('/selectStock/' + stockId)
      .then((res) => {
        if (res.data.quantity >= 1) {
          let addToCart = {
            'id': res.data.id,
            'name': res.data.name,
            'quantity': 1,
            'price': res.data.sale_price,
            'subtotal': res.data.sale_price * 1
          }
          setCart([...cart, addToCart]);
          setLoading(false);
        }
      });
  }

  const addProductToCartText = async (query) => {
    setLoading(true);
    http.post('/findStock/' + query)
      .then((res) => {
        if (res.data.quantity >= 1) {
          let addToCart = {
            'id': res.data.id,
            'name': res.data.name,
            'quantity': 1,
            'price': res.data.sale_price,
            'subtotal': res.data.sale_price * 1
          }
          setCart([...cart, addToCart]);
          setLoading(false);
        }
      });
  }

  const removeProduct = async (stockId) => {
    const newCart = cart.filter(cartItem => cartItem.id !== stockId);
    setCart(newCart);
  }

  const [customerDue, setCustomerDue] = useState('');
  const customerAllotment = async (customerId) => {
    http.post('/selectCustomer/' + customerId)
      .then((res) => {
        setCustomerDue(res.data.sale_due);
        setPaidBox(true);
      });
  }

  const [customer, setCustomer] = useState('');

  const [ButtonText, setButtonText] = useState('Confirm Sale');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const toastOptions = {
    autoClose: 400,
    pauseOnHover: true,
  }

  useEffect(() => {
    getStockData();
    getCustomerData();
  }, []);

  useEffect(() => {
    let newTotalAmount = 0;
    for (let x in cart) {
      newTotalAmount = cart[x]['subtotal'] + newTotalAmount;
    }
    setTotalAmount(newTotalAmount);
  }, [cart])

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
              <Form.Label>Barcode / Stock Keeping Unit / Batch Number</Form.Label>
              <Form.Control type="text" onClick={(e) => addProductToCartText(e.target.value)} />
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
              {loading ? 'Loading...' :
                <tbody>
                  {cart ? cart.map((cartProduct, key) =>
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
              }
            </Table>
          </Col>
        </Row>
        <Row>
          <Col sm={8}>

          </Col>
          <Col sm={4}>
            <h5 style={{ borderBottom: '1px solid black' }} className='mb-3'>Total Price: <strong>{totalAmount}</strong></h5>
            <Form.Group className="mb-3">
              <Form.Label>Discount</Form.Label>
              <Form.Control type="text" onChange={(e) => setDiscount(e.target.value)} />
            </Form.Group>
            <h5 style={{ borderBottom: '1px solid black' }} className='mb-3'>Grand Total: <strong>{totalAmount - discount}</strong></h5>
            <Form.Group className="mb-3">
              <Form.Label>Select Customer</Form.Label>
              <Form.Select onChange={(e) => customerAllotment(e.target.value)}>
                <option value=''>Anonymous Customer</option>
                {customerData.map((item) =>
                  <option value={item.id} key={item.id}>{item.name}</option>
                )}
              </Form.Select>
            </Form.Group>
            {customerDue ?
              <p>Total Due: <strong>{customerDue ? customerDue : 0.00}</strong></p>
              : ''}
            {paidBox ?
              <Form.Group className="mb-3">
                <Form.Label>Paid Amount</Form.Label>
                <Form.Control type="text" defaultValue={paid} onChange={(e) => setPaid(e.target.value)} />
              </Form.Group>
              : ''}
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
            <p>Total Items : <strong>{cart.length}</strong></p>
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