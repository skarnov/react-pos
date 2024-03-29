import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import AuthUser from '../components/AuthUser';
import FooterNav from '../components/FooterNav';
import Dashboard from '../pages/Dashboard';

function Login() {
  const { getToken, http, setToken } = AuthUser();
  const [ButtonText, setButtonText] = useState('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const submitForm = () => {
    setButtonText('Processing..');
    http.post('/login', { email: email, password: password })
      .then((res) => {
        setToken(res.data.user, res.data.access_token);
      })
      .catch(function (err) {
        setButtonText('Login');
        var validationErrors = JSON.stringify(err.response.data.errors);
        var validationErrorsArray = JSON.parse(validationErrors);

        for (var k in validationErrorsArray) {
          setErrorMessage(validationErrorsArray[k]);
        }
      })
  }

  /* Check If Already Logged In */
  if (getToken()) {
    return <Dashboard />
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col sm={12}>
            <h4 className='mt-4'>React POS Login</h4>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" onChange={e => setEmail(e.target.value)} placeholder="Enter Your Username" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" onChange={e => setPassword(e.target.value)} placeholder="Enter Your Password" />
            </Form.Group>
            {errorMessage && (
              <Alert variant="danger">
                <Alert.Heading>{errorMessage}</Alert.Heading>
              </Alert>
            )}
            <Button className='btn btn-sm' onClick={submitForm} variant="primary" type="submit">
              {ButtonText}
            </Button>
          </Col>
        </Row>
        <FooterNav />
      </Container>
    </>
  );
}

export default Login; 