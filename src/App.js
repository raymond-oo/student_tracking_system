import React, { } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './Home';
import Login from './Login';
import './App.css';

function App() {
    return (
        <GoogleOAuthProvider clientId="945899431720-vulljqk5528th1uora746n3g2s999uk2.apps.googleusercontent.com">
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;
