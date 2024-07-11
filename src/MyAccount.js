import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import './styles/MyAccount.css';
import toast from 'react-hot-toast';

const MyAccount = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/user/me', {
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
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('sessionToken');
        navigate('/login');
        toast.success('Logged out successfully!', { iconTheme: {
            primary: '#DCB41F',
            secondary: '#333',
        },
        style: {
            backgroundColor: '#333',
            color: '#DCB41F',
        },
    });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <Header />
            <div className="myaccount-container">
                <div className="account-info">
                    <h2>My Account</h2>
                    {user && (
                        <>
                            <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Grade:</strong> {user.grade}</p>
                            <p><strong>Experience With:</strong> {user.list_of_trained_tools.join(', ')}</p>
                            <button className="logout-button" onClick={handleLogout}>Logout</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyAccount;
