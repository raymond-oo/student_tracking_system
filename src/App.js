// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './Home';
import Login from './Login';
import ViewStudents from './ViewStudents';
import MyAccount from './MyAccount';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <GoogleOAuthProvider clientId="945899431720-vulljqk5528th1uora746n3g2s999uk2.apps.googleusercontent.com">
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/view-students" element={<ProtectedRoute><ViewStudents /></ProtectedRoute>} />
                    <Route path="/my-account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
                </Routes>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;
