// components/StudentView.js
import React from 'react';
import '../styles/RespectiveStudent.css';

const RespectiveStudent = ({ student, showLogout, onLogout }) => {
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
                <p><strong>Experience With:</strong> {student.list_of_trained_tools.map(tool => tool.tool_name).join(', ')}</p>
            </div>
            {showLogout && (
                <button className="logout-button" onClick={onLogout}>Logout</button>
            )}
        </div>
    );
};

export default RespectiveStudent;