import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import LoadingPage from './LoadingPage';

const AdminRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/user/me`, {
                    headers: {
                        'Authorization': localStorage.getItem('sessionToken')
                    }
                });
                setIsAdmin(response.data.is_admin);
                setLoading(false);
            } catch (err) {
                setIsAdmin(false);
                setLoading(false);
            }
        };

        checkAdmin();
    }, [API_URL]);

    if (loading) return <LoadingPage />;

    return isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;
