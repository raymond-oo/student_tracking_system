// Home.js
import React from 'react';
import './Home.css';
import logo from './resources/isylogo.png';

const Home = () => {
    return (
        <div className="home-container">
            <header className="home-header">
                <img src={logo} alt="ISY Logo" className="home-logo" />
                <nav className="home-nav">
                    <a href="/home">Home</a>
                    <a href="/view-tools">View Tools</a>
                    <a href="/view-students">View Students</a>
                    <a href="/account">My Account</a>
                </nav>
            </header>
            <main className="home-main">
                <section className="home-banner">
                    <div className="home-video">Photo/Looping Video Of MAKERSPACE</div>
                </section>
                <section className="home-content">
                    <div className="home-content-section">
                        <h2>A makerspace ignites innovation, offering an environment full of tools.</h2>
                        <p>Explore all of the makerspace's tools, ranging from woodworking and electronics to 3D printing and crafting</p>
                        <button>Button (View Tools)</button>
                    </div>
                    <div className="home-content-section">
                        <h2>Empower your creativity with the makerspace and collaborate with fellow students.</h2>
                        <p>Explore all the students who have ventured into the realm of creation inside the makerspace.</p>
                        <button>Button (View Students)</button>
                    </div>
                </section>
            </main>
            <footer className="home-footer">
                {"Raymond Oo 2024"}
            </footer>
        </div>
    );
};

export default Home;
