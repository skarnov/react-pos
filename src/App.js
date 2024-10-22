import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Customer from './components/Customer';

const isAuthenticated = () => {
    return localStorage.getItem('auth_token') !== null;
};

const PrivateRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/" />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Navigate to="/" />} />
                <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
                <Route path="/customer" element={<PrivateRoute element={<Customer />} />} />
            </Routes>
        </Router>
    );
}

export default App;