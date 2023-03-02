import { useEffect, useState, forwardRef } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import AuthUser from '../components/AuthUser';
import { format } from 'date-fns'

export const SaleInvoicePrint = forwardRef((props, ref) => {
  const { http } = AuthUser();
  const [saleData, setSaleData] = useState([]);
  const [saleDetails, setSaleDetails] = useState([]);

  useEffect(() => {
    getSaleData();
  }, []);

  const getSaleData = async () => {
    http.post('/selectSale/' + props.props)
      .then((res) => {
        setSaleData(res.data);
        setSaleDetails(res.data.saleDetails);
      });
  }

  return (
    <div ref={ref}>
      <Container fluid>
        <Row>
          <Col sm={8}>
            {saleData.customerInfo ? <p style={{ marginBottom: '1px' }}>Customer: {saleData.customerInfo.name} </p> : ''}
            {saleData.customerInfo ? <p style={{ marginBottom: '1px' }}>Mobile: {saleData.customerInfo.mobile} </p> : ''}
            {saleData.customerInfo ? <p style={{ marginBottom: '1px' }}>Total Due: {saleData.customerInfo.sale_due}</p> : ''}
          </Col>
          <Col sm={4}>
            <p style={{ marginBottom: '1px' }}>ID: #{saleData.saleInfo ? saleData.saleInfo.id : ''}</p>
            <p style={{ marginBottom: '1px' }}>Date: {saleData.saleInfo ? format(new Date(saleData.saleInfo.created_date), 'd MMM y') : ''}</p>
          </Col>
        </Row>
        { }
        <Table striped bordered hover size="sm" className='mt-2'>
          <thead>
            <tr>
              <th width="50%">Stock Name</th>
              <th width="15%">Quantity</th>
              <th width="10%">Unit</th>
              <th width="15%">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {saleDetails.map((item) =>
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.unit_price}</td>
                <td>{item.subtotal}</td>
              </tr>
            )}
          </tbody>
        </Table>
        <Row>
          <Col sm={6}>

          </Col>
          <Col sm={6}>
            <p style={{ marginBottom: '1px' }}>Subtotal: {saleData.saleInfo ? saleData.saleInfo.total : ''}</p>
            <p style={{ marginBottom: '1px', borderBottom: '1px solid black' }}>Discount: {saleData.saleInfo ? saleData.saleInfo.discount : ''}</p>
            <p style={{ marginBottom: '1px', borderBottom: '1px solid black' }}>Grand Total: {saleData.saleInfo ? saleData.saleInfo.grand_total : ''}</p>
            <p style={{ marginBottom: '1px' }}>Paid: {saleData.saleInfo ? saleData.saleInfo.paid_amount : ''}</p>
            <p>Due: {saleData.saleInfo ? saleData.saleInfo.sale_due : ''}</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
});