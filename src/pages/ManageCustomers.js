import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { Link } from "react-router-dom";
import FooterNav from '../components/FooterNav';
import NavBar from '../components/NavBar';
import AuthUser from '../components/AuthUser';

function ManageCustomers() {
  const { http } = AuthUser();
  const [data, setData] = useState([]);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [filterData, setFilterdata] = useState([]);
  const [query, setQuery] = useState('');

  const [show, setShow] = useState(false);
  const [id, setId] = useState('');

  const closeDeleteModal = () => setShow(false);
  const showDeleteModal = (id) => {
    setShow(true);
    setId(id);
  };

  const getData = async () => {
    http.post('/manageCustomer')
      .then((res) => {
        setData(res.data);
        setFilterdata(res.data);
      });
  }

  const deleteTheItem = (id) => {
    http.post('/deleteCustomer/' + id)
      .then((res) => {
        setSuccessMessage(res.data.msg);
        setShow(false);
        getData();
      })
      .catch(function (err) {
        setErrorMessage(err.response.data.msg);
        setShow(false);
      })
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSearch = (event) => {
    const getSearch = event.target.value;
    if (getSearch.length > 0) {
      const searchData = data.filter((item) => item.name.toLowerCase().includes(getSearch));
      setData(searchData);
    } else {
      setData(filterData);
    }
    setQuery(getSearch);
  }

  return (
    <>
      <Container fluid>
        <NavBar />
        <Row className='mt-5'>
          <Col sm={12}>
            <h4 className='mt-4'>Manage Customers</h4>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Control type="text" value={query} onChange={(e) => handleSearch(e)} placeholder="Search Customer Name, Customer Mobile" />
              </Form.Group>
            </Col>
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
            <Table responsive bordered>
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Name</th>
                  <th className='text-end'>Mobile</th>
                  <th className='text-end'>Total Due</th>
                  <th className='text-end'>Total Sold Amount</th>
                  <th className='text-end'>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.map((item) =>
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td className='text-end'>{item.mobile}</td>
                      <td className='text-end'>{item.sale_due}</td>
                      <td className='text-end'>{item.total_buy}</td>
                      <td className='text-end'>
                        <Button className='btn btn-sm' variant="info" type="button">
                          Paid Due
                        </Button>
                        {' '}
                        <Link to={"/edit_customer/" + item.id}>
                          <Button className='btn btn-sm' variant="primary" type="button">
                            Edit
                          </Button>
                        </Link>
                        {' '}
                        <Button className='btn btn-sm' onClick={() => showDeleteModal(item.id)} variant="danger" type="button">
                          Delete
                        </Button>
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </Table>
          </Col>
        </Row>
        <FooterNav />
      </Container>

      <Modal show={show} onHide={closeDeleteModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this Customer?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={closeDeleteModal}>
            No
          </Button>
          <Button variant="danger" onClick={() => deleteTheItem(id)}>Yes</Button>
        </Modal.Footer>
      </Modal>

    </>
  );
}

export default ManageCustomers;