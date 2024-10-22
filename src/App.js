import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

// Function to check if user is authenticated
const isAuthenticated = () => {
    return localStorage.getItem('auth_token') !== null;
};

// Private Route component to protect routes
const PrivateRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/" />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Navigate to="/" />} /> {/* Redirect /login to home */}
                <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            </Routes>
        </Router>
    );
}

export default App;
