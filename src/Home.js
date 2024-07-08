// Home.js
import React from 'react';
import './design/Home.css';
import Header from './components/Header';

const Home = () => {
    return (
        <div className="home-container">
            <Header />
            <main className="home-main">
                <section className="home-banner">
                    <img src = "https://makerspace.isyedu.org/wp-content/uploads/2022/12/71202320_2206331706138199_7173154348543770624_n.jpg" alt="Makerspace" className='home-banner-photo' />
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