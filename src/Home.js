import React from 'react';
import './styles/Home.css';
import Header from './components/Header';

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
                            <img src='https://scontent-sin6-1.xx.fbcdn.net/v/t1.6435-9/72119344_2206331449471558_8613429196980486144_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=13d280&_nc_ohc=DtuAgU9iSIcQ7kNvgHY22nC&_nc_ht=scontent-sin6-1.xx&oh=00_AYDUXjgWRrpHokJK1jIvjwJ8xCkO1B3TkPUqpPqF_3uPOw&oe=66B8B73E' alt="Makerspace tools" />
                        </div>
                    </div>
                </section>

                <section className="home-content-2">
                    <div className="home-content-section">
                        <div className="content-image">
                            <img src='https://scontent-sin6-3.xx.fbcdn.net/v/t1.6435-9/71543731_2206331509471552_2447555171677372416_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=13d280&_nc_ohc=7fpim2JqKBQQ7kNvgE0IzUz&_nc_ht=scontent-sin6-3.xx&oh=00_AYBlMe33kSs-_9oQ9CxfDTciTJMbtygUlDXZKfRXIu0GSg&oe=66B8A35D' alt="Students in makerspace" />
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