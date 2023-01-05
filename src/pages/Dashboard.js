import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import FooterNav from '../components/FooterNav';
import NavBar from '../components/NavBar';
import AuthUser from '../components/AuthUser';

function Dashboard() {
    const { user } = AuthUser();

    return (
        <>
            <Container fluid>
                <NavBar />
                <Row className='mt-5'>
                    <Col sm={12}>
                        <h3 className='mt-4'>Dashboard</h3>
                        <hr />
                        <Alert variant="primary">
                            <Alert.Heading>Welcome! {user.user_name}</Alert.Heading>
                        </Alert>
                    </Col>
                </Row>
                <FooterNav />
            </Container>
        </>
    )
}

export default Dashboard;