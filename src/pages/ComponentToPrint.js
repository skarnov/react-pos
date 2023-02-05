import { useEffect, useState, forwardRef } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import AuthUser from '../components/AuthUser';

export const ComponentToPrint = forwardRef((props, ref) => {
  const { http } = AuthUser();
  const [saleData, setSaleData] = useState([]);

  console.warn(saleData.customerInfo ? saleData.customerInfo : '');

  useEffect(() => {
    getSaleData();
  }, []);

  const getSaleData = async () => {
    http.post('/lastSale')
      .then((res) => {
        setSaleData(res.data);
      });
  }

  return (
    <div ref={ref}>
      <Container fluid>
        <Row>
          <Col sm={8}>
            {saleData.customerInfo ? <p style={{ marginBottom: '1px' }}>Customer: {saleData.customerInfo.name} </p> : ''}
            {saleData.customerInfo ? <p style={{ marginBottom: '1px' }}>Mobile: {saleData.customerInfo.mobile} </p> : ''}
            <p style={{ marginBottom: '1px' }}>Total Due: </p>
          </Col>


          <Col sm={4}>
            <p style={{ marginBottom: '1px' }}>ID: </p>
            <p style={{ marginBottom: '1px' }}>Date: </p>
          </Col>

        </Row>





        <Table striped bordered hover size="sm" className='mt-2'>
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

            <tr>

              <td>as</td>
              <td>as</td>
              <td>as</td>
              <td>as</td>
              <td>as</td>



            </tr>

          </tbody>
        </Table>

        <Row>

          <Col sm={6}>

          </Col>
          <Col sm={6}>
            <p style={{ marginBottom: '1px' }}>Subtotal: 4566</p>
            <p style={{ marginBottom: '1px', borderBottom: '1px solid black' }}>Discount: 4566</p>
            <p style={{ marginBottom: '1px', borderBottom: '1px solid black' }}>Grand Total: 4566</p>
            <p style={{ marginBottom: '1px' }}>Paid: 4566</p>
            <p>Due: 4566</p>
          </Col>



        </Row>


      </Container>

    </div>
  );
});