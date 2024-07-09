// MyAccount.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import './design/MyAccount.css';
import Header from './components/Header';

const MyAccount = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        googleLogout();
        localStorage.removeItem('sessionToken');
        navigate('/login');
    };

    return (
        <div>
            <Header />
            <div className="myaccount-container">
                <div className="myaccount-content">
                    <h2>My Account</h2>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyAccount;
