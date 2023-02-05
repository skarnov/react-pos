import { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Modal, Button, Alert, Form, Table } from 'react-bootstrap';
import AuthUser from '../components/AuthUser';
import NavBar from '../components/NavBar';
import FooterNav from '../components/FooterNav';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useReactToPrint } from 'react-to-print';
import { ComponentToPrint } from './ComponentToPrint';

function AddSale() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [show, setShow] = useState(false);
  const closeModal = () => setShow(false);
  const showInvoice = () => {
    setShow(true);
  };

  const toastOptions = {
    autoClose: 400,
    pauseOnHover: true,
  }
  const { http } = AuthUser();
  const [loading, setLoading] = useState('Loading...');
  let [cart, setCart] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paidBox, setPaidBox] = useState(false);
  const [paid, setPaid] = useState(0);

  useEffect(() => {
    getCart();
    getStockData();
    getCustomerData();
  }, []);

  const getCart = async () => {
    http.post('/cart')
      .then((res) => {
        setCart(res.data);
        setLoading(false);
      });
  }

  const getStockData = async () => {
    http.post('/availableStock')
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

  const addProductToCart = async (stockId) => {
    http.post('/selectCart/' + stockId)
      .then((res) => {
        setCart(res.data);
        toast('Added To Cart', toastOptions);
      });
  }

  const addProductToCartText = async (query) => {
    http.post('/findStock/' + query)
      .then((res) => {
        setCart(res.data);
        toast('Added To Cart', toastOptions);
      })
      .catch(function (err) {
        toast(err.response.data.msg);
      })
  }

  const increaseQuantity = async (stockId) => {
    http.post('/updateCartIncrease/' + stockId)
      .then((res) => {
        setCart(res.data);
        toast('Updated Cart Quantity!');
      });
  }

  const decreaseQuantity = async (stockId) => {
    http.post('/updateCartDecrease/' + stockId)
      .then((res) => {
        setCart(res.data);
        toast('Updated Cart Quantity!');
      });
  }

  useEffect(() => {
    let newTotalAmount = 0;
    for (let x in cart) {
      newTotalAmount = cart[x]['quantity'] * cart[x]['unit'] + newTotalAmount;
    }
    setTotalAmount(newTotalAmount);
  }, [cart])

  const removeProduct = async (stockId) => {
    http.post('/deleteCart/' + stockId)
      .then((res) => {
        setCart(res.data);
        toast('Removed Stock!', toastOptions);
      });
  }

  const [customerDue, setCustomerDue] = useState('');
  const [customer, setCustomer] = useState('');
  const customerAllotment = async (customerId) => {
    http.post('/selectCustomer/' + customerId)
      .then((res) => {
        setCustomerDue(res.data.sale_due);
        setPaidBox(true);
        setCustomer(customerId);
      });
  }

  const [isDisabled, setDisabled] = useState(false);
  const [ButtonText, setButtonText] = useState('Confirm Sale');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const saveSale = () => {
    setButtonText('Processing..');
    http.post('/saveSale', {
      discount: discount,
      customer: customer,
      paid: paid,
    })
      .then(function () {
        setDisabled(true);
        setButtonText('Confirmed Sold');
        setSuccessMessage('Sold!');
      })
      .catch(function (err) {
        setButtonText('Confirm Sale');
        setErrorMessage(err.response.data.msg);
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
                <option value="">Select One</option>
                {stockData.map((item) =>
                  <option value={item.id} key={item.id}>{item.name}</option>
                )}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Barcode / Stock Keeping Unit / Batch Number</Form.Label>
              <Form.Control type="text" onChange={(e) => addProductToCartText(e.target.value)} />
            </Form.Group>
          </Col>
          <Col sm={8}>
            {loading ? 'Loading...' :
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th width="50%">Stock Name</th>
                    <th width="15%">Quantity</th>
                    <th width="10%">Unit</th>
                    <th width="15%">Subtotal</th>
                    <th className="text-end" width="10%">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {cart ? cart.map((cartProduct, key) =>
                    <tr key={key}>
                      <td>{cartProduct.name}</td>
                      <td>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <button className="btn btn-outline-primary" type="button" onClick={() => decreaseQuantity(cartProduct.fk_stock_id)}>-</button>
                          </div>
                          <input type="text" className="form-control" value={cartProduct.quantity} />
                          <div className="input-group-prepend">
                            <button className="btn btn-outline-primary" type="button" onClick={() => increaseQuantity(cartProduct.fk_stock_id)}>+</button>
                          </div>
                        </div>
                      </td>
                      <td>{cartProduct.unit}</td>
                      <td>{cartProduct.quantity * cartProduct.unit}</td>
                      <td className="text-end">
                        <button className='btn btn-danger btn-sm' onClick={() => removeProduct(cartProduct.fk_stock_id)}>Remove</button>
                      </td>
                    </tr>)
                    : 'No Items in Cart'}
                </tbody>
              </Table>
            }
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
            <Button className='btn btn-sm' disabled={isDisabled} onClick={saveSale} variant="success" type="submit">
              {ButtonText}
            </Button>
            {' '}
            <Button className='btn btn-sm' onClick={() => showInvoice()} variant="warning" type="submit">
              Show Invoice
            </Button>
          </Col>
          <ToastContainer />
        </Row>
        <FooterNav />
      </Container>

      <Modal show={show} onHide={closeModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ComponentToPrint ref={componentRef} />
          <Button variant="primary" className='btn-sm' onClick={handlePrint}>Print</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddSale;