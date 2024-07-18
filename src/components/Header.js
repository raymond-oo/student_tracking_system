import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from '../resources/isylogo.png';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
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
    }, []);

    useEffect(() => {
        if(error) {
            navigate('/login');
        }
    }, [error, navigate]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <header className="home-header">
            <Link to="/home">
                <img src={logo} alt="ISY Logo" className="home-logo" />
            </Link>
            <nav className="home-nav">
                <Link to="/">Home</Link>
                <Link to="/tools">View Tools</Link>
                <Link to="/view-tools">View Tools</Link> 
                <Link to="/view-students">View Students</Link>
                {user?.is_admin && <Link to="/edit-records">Edit Records</Link>}
                <Link to="/my-account">My Account</Link>
            </nav>
        </header>
    );
};

export default Header;
