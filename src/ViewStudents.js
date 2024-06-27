import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import logo from './resources/isylogo.png';
import './design/ViewStudents.css';

const ViewStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCriteria, setSortCriteria] = useState('alphabetical');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/students');
                setStudents(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSortChange = (e) => {
        const criteria = e.target.value;
        setSortCriteria(criteria);
        sortStudents(criteria, students);
    };

    const sortStudents = useCallback((criteria, studentsList) => {
        let sortedStudents;
        if (criteria === 'alphabetical') {
            sortedStudents = [...studentsList].sort((a, b) => 
                `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
            );
        } else if (criteria === 'grade') {
            sortedStudents = [...studentsList].sort((a, b) => b.grade - a.grade);
        }
        setStudents(sortedStudents);
    }, []);

    useEffect(() => {
        if (students.length > 0) {
            sortStudents(sortCriteria, students);
        }
    }, [students, sortCriteria, sortStudents]);

    const filteredStudents = students.filter(student =>
        `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="viewstudents-container">
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
            <div className="students-container">
                <div className="search-sort-container">
                    <input
                        type="text"
                        placeholder="Enter a student name"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-bar"
                    />
                    <select value={sortCriteria} onChange={handleSortChange} className="sort-dropdown">
                        <option value="alphabetical">Sort By: Alphabetical</option>
                        <option value="grade">Sort By: Grade Level</option>
                    </select>
                </div>
                <div className="students-grid">
                    {filteredStudents.map((student, index) => (
                        <div className="student-card" key={index}>
                            <div className="student-card-header">
                                <div className="student-profile-pic">
                                    <img src={student.profile_image} alt="Profile" />
                                </div>
                                <button className="view-more-btn">{'>'} View More</button>
                            </div>
                            <div className="student-info">
                                <h3>{student.first_name} {student.last_name}</h3>
                                <p><strong>Grade:</strong> {student.grade}</p>
                                <p><strong>Experience With:</strong> {student.list_of_trained_tools.join(', ')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewStudents;
