import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import FooterNav from '../components/FooterNav';
import NavBar from '../components/NavBar';
import AuthUser from '../components/AuthUser';

function ManageStock() {

  const { http } = AuthUser();
  const [data, setData] = useState([]);

  const [filterData, setFilterdata] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const getData = async () => {
      http.post('/manageStock')
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
                <Form.Control type="text" value={query} onChange={(e) => handleSearch(e)} placeholder="Search Stock ID, Stock Name" />
              </Form.Group>
            </Col>
            <Table responsive bordered>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Barcode</th>
                  <th>SKU</th>
                  <th className='text-end'>Buy Price</th>
                  <th className='text-end'>Sale Price</th>
                  <th className='text-end'>Quantity</th>
                  <th className='text-end'>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.map((item) =>
                    <tr>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.barcode}</td>
                      <td>{item.sku}</td>
                      <td className='text-end'>{item.buy_price}</td>
                      <td className='text-end'>{item.sale_price}</td>
                      <td className='text-end'>{item.quantity}</td>
                      <td className='text-end'>
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

export default ManageStock;