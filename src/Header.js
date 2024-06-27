// Header.js

import React from 'react';
import { Link } from 'react-router-dom';
import logo from './resources/isylogo.png';
import './design/Header.css';

const Header = () => {
    return (
        <header className="home-header">
            <Link to="/home">
                <img src={logo} alt="ISY Logo" className="home-logo" />
            </Link>
            <nav className="home-nav">
                <a href="/home">Home</a>
                <a href="/view-tools">View Tools</a>
                <a href="/view-students">View Students</a>
                <a href="/account">My Account</a>
            </nav>
        </header>
    );
};

export default Header;
