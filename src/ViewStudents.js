import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewStudents.css';

const ViewStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredStudents = students.filter(student =>
        `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="students-container">
            <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
            />
            {filteredStudents.map((student, index) => (
                <div className="student-card" key={index}>
                    <h3>{student.first_name} {student.last_name}</h3>
                    <p>Grade: {student.grade}</p>
                    <p>Experience With: {student.list_of_trained_tools.join(', ')}</p>
                </div>
            ))}
        </div>
    );
};

export default ViewStudents;
