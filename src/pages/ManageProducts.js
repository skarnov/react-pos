import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col, Modal, Button, Alert, Form, Table } from 'react-bootstrap';
import AuthUser from '../components/AuthUser';
import NavBar from '../components/NavBar';
import FooterNav from '../components/FooterNav';

function ManageProduct() {
  const { http } = AuthUser();
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [show, setShow] = useState(false);
  const [id, setId] = useState('');

  const closeDeleteModal = () => setShow(false);
  const showDeleteModal = (id) => {
    setShow(true);
    setId(id);
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    http.post('/manageProduct')
      .then((res) => {
        setData(res.data);
      });
  }

  const deleteTheItem = (id) => {
    http.post('/deleteProduct/' + id)
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

  return (
    <>
      <Container fluid>
        <NavBar />
        <Row className='mt-5'>
          <Col sm={12}>
            <h4 className='mt-4'>Manage Products</h4>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Control type="text" onChange={(e) => setSearch(e.target.value)} placeholder="Search Product Name" />
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
            <Table responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Sale Count</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data
                  .filter((item) => {
                    return search.toLowerCase() === ''
                      ? item
                      : item.name.toLowerCase().includes(search)
                  })
                  .map((item) =>
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.sale_count}</td>
                      <td>
                        <Link to={"/edit_product/" + item.id}>
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
          Are you sure you want to delete this Product?
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

export default ManageProduct;