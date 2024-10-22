import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import React from 'react';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Get the token from local storage
            const token = localStorage.getItem('auth_token');
    
            // Call the logout API endpoint with the token in headers
            await axios.post('/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${token}` // Include the token in the Authorization header
                }
            });
    
            // Remove the token from localStorage
            localStorage.removeItem('auth_token');
            console.log('Logged out');
            // Redirect to the login page
            navigate('/'); // Redirect to the login page after logout
        } catch (err) {
            console.error('Logout failed', err); // Log any errors
        }
    };
    

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <header className="bg-white shadow-lg p-4">
                <nav className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">POS</h2>
                    <ul className="flex space-x-6">
                        <li>
                            <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">Logout</button>
                        </li>
                    </ul>
                </nav>
            </header>
            <main className="flex-1 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
                        <h2 className="text-xl font-semibold mb-2">Total Sales</h2>
                        <div className="h-40 bg-blue-100 flex items-center justify-center rounded-lg">
                            <span className="text-gray-600">Chart Placeholder</span>
                        </div>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
                        <h2 className="text-xl font-semibold mb-2">Products Sold</h2>
                        <div className="h-40 bg-green-100 flex items-center justify-center rounded-lg">
                            <span className="text-gray-600">Chart Placeholder</span>
                        </div>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
                        <h2 className="text-xl font-semibold mb-2">Pending Orders</h2>
                        <div className="h-40 bg-yellow-100 flex items-center justify-center rounded-lg">
                            <span className="text-gray-600">Chart Placeholder</span>
                        </div>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
                        <h2 className="text-xl font-semibold mb-2">Customers</h2>
                        <div className="h-40 bg-red-100 flex items-center justify-center rounded-lg">
                            <span className="text-gray-600">Chart Placeholder</span>
                        </div>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
                        <h2 className="text-xl font-semibold mb-2">Revenue</h2>
                        <div className="h-40 bg-purple-100 flex items-center justify-center rounded-lg">
                            <span className="text-gray-600">Chart Placeholder</span>
                        </div>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
                        <h2 className="text-xl font-semibold mb-2">Inventory</h2>
                        <div className="h-40 bg-orange-100 flex items-center justify-center rounded-lg">
                            <span className="text-gray-600">Chart Placeholder</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
