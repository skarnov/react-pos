import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/axios';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('authToken');
      navigate('/login');
    }
  };

  React.useEffect(() => {
    handleLogout();
  }, []);

  return <p>Logging out...</p>;
};

export default Logout;