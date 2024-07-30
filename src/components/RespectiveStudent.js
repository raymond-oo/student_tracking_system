// components/RespectiveStudent.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RespectiveStudent.css';
import ToolCard from './ToolCard';

const RespectiveStudent = ({ student, showLogout, onLogout }) => {

    const navigate = useNavigate();

    const handleViewMore = (toolId) => {
        navigate(`/tool/${toolId}`);
    };

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
                {student.list_of_trained_tools.map((tool, index) => (
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