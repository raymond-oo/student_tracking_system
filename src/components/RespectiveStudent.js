// components/RespectiveStudent.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/RespectiveStudent.css';
import ToolCard from './ToolCard';

const RespectiveStudent = ({ student, showLogout, onLogout }) => {
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchTools = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/tools`, {
                    headers: {
                        'Authorization': localStorage.getItem('sessionToken')
                    }
                });
                setTools(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchTools();
    }, [API_URL]);

    const handleViewMore = (toolId) => {
        navigate(`/tool/${toolId}`);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="student-view">
            <div className="student-header">
                {student.profile_image && (
                    <img src={student.profile_image} alt={`${student.first_name} ${student.last_name}`} className="profile-image" />
                )}
                <h2>{student.first_name} {student.last_name}</h2>
            </div>
            <div className="student-details">
                <p><strong>Grade:</strong> {student.grade}</p>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Experience With:</strong></p>
            </div>
            <div className="tools-grid">
                {tools.map((tool, index) => (
                    <ToolCard 
                        key={index} 
                        tool={tool} 
                        onViewMore={handleViewMore}
                    />
                ))}
            </div>
            {showLogout && (
                <button className="logout-button" onClick={onLogout}>Logout</button>
            )}
        </div>
    );
};

export default RespectiveStudent;
