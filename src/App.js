import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import './App.css';

function App() {
    const responseMessage = async (response) => {
        try {
            const res = await fetch('http://localhost:5001/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: response.credential }),
            });
            const data = await res.json();
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    const errorMessage = (error) => {
        console.log(error);
    };

    return (
        <div className="container">
            <div className="mission-section">
                <h2 className="mission-title">ISY Makerspace Student Tracking System</h2>
                <p className="mission-text">Computer Science IA Project</p>
                <div className="google-login-container">
                    <GoogleLogin
                        onSuccess={responseMessage}
                        onError={errorMessage}
                        useOneTap
                        className="google-login-button"
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
