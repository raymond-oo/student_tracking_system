import React from 'react';
import './styles/Home.css';
import Header from './components/Header';
import Makerspace_Tools from './resources/Makerspace_Tools.jpg';
import Collaborating_With_Students from './resources/Collaborate_With_Students.jpg'

const Home = () => {
    return (
        <div className="home-container">
            <Header />
            <main className="home-main">
                <section className="home-banner">
                    <img 
                        src="https://makerspace.isyedu.org/wp-content/uploads/2022/12/71202320_2206331706138199_7173154348543770624_n.jpg" 
                        alt="Makerspace" 
                        className='home-banner-photo' 
                    />
                    <div className="home-banner-text">
                        <h1>Welcome to the</h1>
                        <h1 className='yellow-text'>Makerspace</h1>
                    </div>
                </section>
                
                <section className="home-content">
                    <div className="home-content-section">
                        <div className="content-text">
                            <h2>A makerspace ignites innovation, offering an environment full of tools.</h2>
                            <p>Explore all of the makerspace's tools, ranging from woodworking and electronics to 3D printing and crafting.</p>
                            <button className='view-button' onClick={() => window.location.href = '/view-tools'}>View Tools</button>
                        </div>
                        <div className="content-image">
                            <img src={Makerspace_Tools} alt="Makerspace tools" />
                        </div>
                    </div>
                </section>

                <section className="home-content-2">
                    <div className="home-content-section">
                        <div className="content-image">
                            <img src={Collaborating_With_Students} alt="Collaborating with students" />
                        </div>
                        <div className="content-text">
                            <h2>Empower your creativity with the makerspace and collaborate with fellow students.</h2>
                            <p>Explore all the students who have ventured into the realm of creation inside the makerspace.</p>
                            <button className="view-button" onClick={() => window.location.href = '/view-students'}>View Students</button>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="home-footer">
                <p>© Raymond Oo 2024</p>
            </footer>
        </div>
    );
};

export default Home;