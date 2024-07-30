import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/RespectiveStudent.css';
import ToolCard from './ToolCard';

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

                console.log("Fetched Tools:", fetchedTools);
                console.log("Student's List of Trained Tools:", student.list_of_trained_tools);

                const filteredTrainedTools = fetchedTools.filter(tool => student.list_of_trained_tools.includes(tool.tool_id));

                console.log("Filtered Trained Tools:", filteredTrainedTools);

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

            {showLogout && (
                <button className="logout-button" onClick={onLogout}>Logout</button>
            )}
        </div>
    );
};

export default RespectiveStudent;
