import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import FooterNav from '../components/FooterNav';
import NavBar from '../components/NavBar';

function ManageProduct() {

  const [data, setData] = useState([]);

  useEffect(async () => {
    let result = await fetch("http://localhost/laravel-pos/public/api/manageProduct");
    result = await result.json();
    setData(result)
  }, [])

  return (
    <>
      <Container fluid>
        <NavBar />
        <Row className='mt-5'>
          <Col sm={12}>
            <h4 className='mt-4'>Manage Stocks</h4>
            <hr />
          </Col>
        </Row>

        <Row>
          <Col sm={12}>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Control type="text" placeholder="Search Stock Name" />
              </Form.Group>
            </Col>

            <Table responsive>
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Name</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.map((item) =>
                    <tr>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>
                        <Button className='btn btn-sm' variant="primary" type="button">
                          Edit
                        </Button>
                        {' '}
                        <Button className='btn btn-sm' variant="danger" type="button">
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
    </>
  );
}

export default ManageProduct;