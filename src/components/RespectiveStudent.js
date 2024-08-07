import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/RespectiveStudent.css';
import ToolCard from './ToolCard';
import LoadingPage from './LoadingPage';

const RespectiveStudent = ({ student, showLogout, onLogout }) => {
    const [trainedTools, setTrainedTools] = useState([]);
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
                const fetchedTools = response.data;
        
                const filteredTrainedTools = fetchedTools.filter(tool => 
                    student.list_of_trained_tools.some(trainedTool => 
                        trainedTool.tool_id === tool.tool_id
                    )
                );
        
                setTrainedTools(filteredTrainedTools);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchTools();
    }, [API_URL, student.list_of_trained_tools]);

    const handleViewMore = (toolId) => {
        navigate(`/tool/${toolId}`);
    };

    const formatUpdatedAt = (timestamp) => {
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        return `${formattedDate} at ${formattedTime}`;
    };

    if (loading) return <LoadingPage />;
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
                <p><strong>Last Updated:</strong> {formatUpdatedAt(student.updatedAt)}</p>
                {showLogout && (
                <button className="logout-button" onClick={onLogout}>Logout</button>
            )}
            </div>
            {student && !student.is_admin && (
            <div className="tools-container">
                <h3>Trained Tools</h3>
                <div className="tools-grid">
                    {trainedTools.map((tool, index) => (
                        <ToolCard 
                            key={index} 
                            tool={tool} 
                            onViewMore={handleViewMore}
                        />
                    ))}
                </div>
            </div>
        )}
        </div>
    );
};

export default RespectiveStudent;
