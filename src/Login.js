// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import './styles/Login.css';

function Login() {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const responseMessage = async (response) => {
        try {
            const res = await fetch('http://localhost:5001/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: response.credential }),
            });
            const data = await res.json();
            console.log(data);

            // Store the session token in localStorage
            localStorage.setItem('sessionToken', data.sessionToken);

            navigate('/home');
        } catch (error) {
            console.log(error);
            setError('An error occurred during login. Please try again.');
        }
    };

    const errorMessage = (error) => {
        console.log(error);
        setError('An error occurred during login. Please try again.');
    };

    return (
        <div className="container">
            <div className="title-section">
                <h2 className="title-text">ISY Makerspace Student Tracking System</h2>
                <p className="subtitle-text">Computer Science IA Project</p>
                <div className="centered-container">
                    <div className="google-login-container">
                        <GoogleLogin
                            onSuccess={responseMessage}
                            onError={errorMessage}
                            useOneTap
                            className="google-login-button"
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                </div>
            </div>
        </div>
    );
}

export default Login;
