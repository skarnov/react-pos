import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import FooterNav from '../components/FooterNav';
import NavBar from '../components/NavBar';
import AuthUser from '../components/AuthUser';
import { format, formatDistance, formatRelative, subDays } from 'date-fns'

function ManageSales() {
  const { http } = AuthUser();
  const [data, setData] = useState([]);

  const [filterData, setFilterdata] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    http.post('/manageSale')
      .then((res) => {
        setData(res.data);
        setFilterdata(res.data);
      });
  }

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
            <h4 className='mt-4'>Manage Sales</h4>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Control type="text" value={query} onChange={(e) => handleSearch(e)} placeholder="Search Product Name" />
              </Form.Group>
            </Col>
            <Table responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th className='text-end'>Income Amount</th>
                  <th className='text-end'>Sale Total</th>
                  <th className='text-end'>Discount</th>
                  <th className='text-end'>Grand Total</th>
                  <th className='text-end'>Paid Amount</th>
                  <th className='text-end'>Sale Due</th>
                  <th className='text-end'>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) =>



                  <tr>
                    <td>{item.id}</td>
                    <td>{format(new Date(item.created_date), 'Do MMM y')}</td>
                    <td className='text-end'>{item.income_amount}</td>
                    <td className='text-end'>{item.total}</td>
                    <td className='text-end'>{item.discount}</td>
                    <td className='text-end'>{item.grand_total}</td>
                    <td className='text-end'>{item.paid_amount}</td>
                    <td className='text-end'>{item.sale_due}</td>
                    <td className='text-end'>
                      <Button className='btn btn-sm' variant="primary" type="button">
                        Invoice
                      </Button>
                      {' '}
                      <Link to={"/edit_sale/" + item.id}>
                        <Button className='btn btn-sm' variant="primary" type="button">
                          Edit
                        </Button>
                      </Link>
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

export default ManageSales;