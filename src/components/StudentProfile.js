// StudentProfile.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import '../styles/StudentProfile.css';

const StudentProfile = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/students/${id}`, {
                    headers: {
                        'Authorization': localStorage.getItem('sessionToken')
                    }
                });
                setStudent(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchStudent();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!student) return <div>Student not found</div>;

    return (
        <div>
            <Header />
            <div className="student-profile-container">
                <div className="profile-content">
                    <button className="back-button" onClick={() => navigate('/view-students')}>Back to Students</button>
                    <div className="profile-header">
                        <img src={student.profile_image} alt={`${student.first_name} ${student.last_name}`} className="profile-image" />
                        <h2>{student.first_name} {student.last_name}</h2>
                    </div>
                    <div className="profile-details">
                        <p><strong>Grade:</strong> {student.grade}</p>
                        <p><strong>Email:</strong> {student.email}</p>
                        <p><strong>Experience With:</strong> {student.list_of_trained_tools.join(', ')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;