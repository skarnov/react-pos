import { useState } from 'react';
import { Button, Alert, Col, Container, Form, Spinner } from 'react-bootstrap';
import AuthUser from '../components/AuthUser';
import FooterNav from '../components/FooterNav';
import Dashboard from '../pages/Dashboard';

function Login() {
  const { getToken, http, setToken } = AuthUser();
  const [buttonText, setButtonText] = useState('Login');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const submitForm = () => {
    setLoading(true);
    setButtonText('Processing..');
    
    http.post('/login', { email, password })
      .then((res) => {
        setToken(res.data.user, res.data.access_token);
      })
      .catch((err) => {
        setLoading(false);
        setButtonText('Login');
        
        const validationErrors = err.response?.data?.errors;
        if (validationErrors) {
          const firstError = Object.values(validationErrors)[0];
          setErrorMessage(firstError);
        } else {
          setErrorMessage('An unexpected error occurred.');
        }
      });
  }

  /* Check If Already Logged In */
  if (getToken()) {
    return <Dashboard />;
  }

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Col sm={12} md={6} lg={4}>
        <div style={{ padding: '30px', borderRadius: '10px', boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)' }}>
          <h4 className="text-center mb-4">React POS Login</h4>
          <Form>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            {errorMessage && (
              <Alert variant="danger">
                <Alert.Heading>Error</Alert.Heading>
                <p>{errorMessage}</p>
              </Alert>
            )}

            <Button
              className="w-100"
              variant="primary"
              onClick={submitForm}
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : buttonText}
            </Button>
          </Form>
        </div>
        <FooterNav className="mt-4" />
      </Col>
    </Container>
  );
}

export default Login;