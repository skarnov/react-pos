import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import FooterNav from './FooterNav';
import NavBar from './NavBar';

function AddProduct() {
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
            <Table responsive>
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Product Name</th>
                  <th>Action</th>

                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Product Name</td>
                  <td>Action</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Product Name</td>
                  <td>Action</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Product Name</td>
                  <td>Action</td>

                </tr>
              </tbody>
            </Table>


          </Col>
        </Row>
        <FooterNav />
      </Container>
    </>
  );
}

export default AddProduct;