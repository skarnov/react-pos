import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';

function FooterNav() {
    return (

        <>
            <Container fluid>
                <Row className='mt-5'>
                    <Col sm={12}>
                        <h3 className='mt-4'>Dashboard</h3>
                        <hr />
                    </Col>
                </Row>
                <Navbar fixed="bottom">
                    <Container>
                        <Navbar.Collapse className="justify-content-end">
                            <Navbar.Text>
                                &copy; <a href="https://evistechnology.com/">Evis Technology</a> All Rights Reserved.
                            </Navbar.Text>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </Container>
        </>

    )
}

export default FooterNav;