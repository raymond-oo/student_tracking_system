import { Link } from 'react-router-dom';
import logo from '../resources/isylogo.png';
import '../design/Header.css';

const Header = () => {

    return (
        <header className="home-header">
            <Link to="/home">
                <img src={logo} alt="ISY Logo" className="home-logo" />
            </Link>
            <nav className="home-nav">
                <Link to="/home">Home</Link>
                <Link to="/view-tools">View Tools</Link>
                <Link to="/view-students">View Students</Link>
                <Link to="/my-account">My Account</Link>
            </nav>
        </header>
    );
};

export default Header;