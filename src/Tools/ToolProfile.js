import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import '../styles/ToolProfile.css';
import backarrow from '../resources/back-arrow.svg';
import LoadingPage from '../components/LoadingPage';

const ToolProfile = () => {
    const [tool, setTool] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchTool = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/tools/${id}`, {
                    headers: {
                        'Authorization': localStorage.getItem('sessionToken')
                    }
                });
                setTool(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchTool();
    }, [id, API_URL]);

    if (loading) return <LoadingPage />;
    if (error) return <div>Error: {error.message}</div>;
    if (!tool) return <div>Tool not found</div>;

    return (
        <div>
            <Header />
            <div className="back-button" onClick={() => navigate('/view-tools')}>
                    <img src={backarrow} alt="Go Back" />
                    <span>Go Back</span>
                </div>
            <div className="tool-profile-container">
                <div className="tool-profile">
                    <div className="tool-header">
                        <div className="tool-image-placeholder">
                            <img src={tool.imageUrl} alt={tool.tool_name} />
                        </div>
                        <div className="tool-details">
                            <h1>{tool.tool_name}</h1>
                            <h2>Model: {tool.tool_model}</h2>
                            <h3>Category: {tool.tool_category}</h3>
                            <p><strong>Restriction Notice:</strong> {tool.restriction_id}</p>
                            <p><strong>Location:</strong> {tool.tool_location}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToolProfile;
