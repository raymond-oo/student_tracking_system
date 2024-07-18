// ViewStudents.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/ViewStudents.css';
import Header from './components/Header';

const ViewStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCriteria, setSortCriteria] = useState('lastname');
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    const handleViewMore = (studentId) => {
        navigate(`/student/${studentId}`);
    };

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/students`, {
                    headers: {
                        'Authorization': localStorage.getItem('sessionToken')
                    }
                });
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
        if (criteria === 'lastname') {
            sortedStudents = [...studentsList].sort((a, b) => 
                `${a.last_name}`.localeCompare(`${b.last_name}`)
            );
        } else if (criteria === 'firstname') {
            sortedStudents = [...studentsList].sort((a, b) =>
                `${a.first_name}`.localeCompare(`${b.first_name}`)
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
        `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${student.grade}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${student.list_of_trained_tools}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <Header />
            <div className="students-container">
                <h1>Empower your creativity with the makerspace and collaborate with fellow students.</h1>
                <p>Explore all the students who have ventured into the realm of creation inside the makerspace</p>
                    <div className="search-sort-container">
                        <input
                            type="text"
                            placeholder="Enter a student name"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="search-bar"
                        />
                        <select value={sortCriteria} onChange={handleSortChange} className="sort-dropdown">
                            <option value="lastname">Sort By: Last Name A → Z </option>
                            <option value="firstname"> Sort By: First Name A → Z </option>
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
                                    <button onClick={() => handleViewMore(student._id)} className="view-more-btn">{'>'} View More</button>
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
