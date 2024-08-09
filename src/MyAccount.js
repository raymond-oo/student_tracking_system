// MyAccount.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import './styles/MyAccount.css';
import toast from 'react-hot-toast';
import RespectiveStudent from './components/RespectiveStudent';
import LoadingPage from './components/LoadingPage';

const MyAccount = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/user/me`, {
                    headers: {
                        'Authorization': localStorage.getItem('sessionToken')
                    }
                });
                setUser(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchUser();
    }, [API_URL]);

    const handleLogout = () => {
        localStorage.removeItem('sessionToken');
        navigate('/login');
        toast.success('Logged out successfully!', {
            iconTheme: {
                primary: '#DCB41F',
                secondary: '#333',
            },
            style: {
                backgroundColor: '#333',
                color: '#DCB41F',
            },
        });
    };

    if (loading) return <LoadingPage />;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <Header />
            <div className="myaccount-container">
                <h2>My Account</h2>
                {user && (
                    <RespectiveStudent student={user} showLogout={true} onLogout={handleLogout} />
                )}
            </div>
        </div>
    );
};

export default MyAccount;