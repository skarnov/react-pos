import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { Link } from "react-router-dom";
import FooterNav from '../components/FooterNav';
import NavBar from '../components/NavBar';
import AuthUser from '../components/AuthUser';

function ManageCustomers() {
  const { http } = AuthUser();
  const [data, setData] = useState([]);

  const [filterData, setFilterdata] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const getData = async () => {
      http.post('/manageCustomer')
        .then((res) => {
          setData(res.data);
          setFilterdata(res.data);
        });
    }
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


  // const [data, setData] = useState([]);

  // useEffect(async () => {
  //   let result = await fetch("http://localhost/laravel-pos/public/api/manageCustomer");
  //   result = await result.json();
  //   setData(result)
  // }, [])

  // async function deleteCustomer(customer_id) {
  //   let result = await fetch("http://localhost/laravel-pos/public/api/deleteCustomer/" + customer_id, {
  //     method: 'GET'
  //   });
  //   result = await result.json();
  //   getData();
  // }

  // async function getData() {
  //   let result = await fetch("http://localhost/laravel-pos/public/api/manageCustomer");
  //   result = await result.json();
  //   setData(result)
  // }

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
            <Table responsive bordered>
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Customer Name</th>
                  <th className='text-end'>Total Due</th>
                  <th className='text-end'>Total Sold Amount</th>
                  <th className='text-end'>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.map((item) =>
                    <tr>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td className='text-end'>{item.sale_due}</td>
                      <td className='text-end'>{item.total_buy}</td>
                      <td className='text-end'>
                        <Link to={"/editCustomer/" + item.customer_id}>

                          <Button className='btn btn-sm' variant="primary" type="button" onClick={'edit'}>
                            Edit
                          </Button>
                        </Link>
                        {' '}
                        {/* <Button className='btn btn-sm' variant="danger" type="button" onClick={() => deleteCustomer(item.customer_id)}>
                          Delete
                        </Button> */}
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