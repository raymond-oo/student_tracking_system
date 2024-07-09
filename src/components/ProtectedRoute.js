// components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const sessionToken = localStorage.getItem('sessionToken');

    return sessionToken ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
