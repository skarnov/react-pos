import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { Link } from "react-router-dom";
import FooterNav from '../components/FooterNav';
import NavBar from '../components/NavBar';

function ManageCustomers() {

  const [data, setData] = useState([]);

  useEffect(async () => {
    let result = await fetch("http://localhost/laravel-pos/public/api/manageCustomer");
    result = await result.json();
    setData(result)
  }, [])

  async function deleteCustomer(customer_id) {
    let result = await fetch("http://localhost/laravel-pos/public/api/deleteCustomer/" + customer_id, {
      method: 'GET'
    });
    result = await result.json();
    getData();
  }

  async function getData() {
    let result = await fetch("http://localhost/laravel-pos/public/api/manageCustomer");
    result = await result.json();
    setData(result)
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
            <Table responsive>
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Customer Name</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.map((item) =>
                    <tr>
                      <td>{item.customer_id}</td>
                      <td>{item.name}</td>
                      <td><img style={{ width: 100 }} src={"http://localhost/laravel-pos/storage/app/" + item.image} /></td>
                      <td>
                        <Link to={"/editCustomer/" + item.customer_id}>

                          <Button className='btn btn-sm' variant="primary" type="button" onClick={'edit'}>
                            Edit
                          </Button>
                        </Link>

                        {' '}
                        <Button className='btn btn-sm' variant="danger" type="button" onClick={() => deleteCustomer(item.customer_id)}>
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

export default ManageCustomers;