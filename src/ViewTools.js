// ViewTools.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/ViewTools.css';
import Header from './components/Header';

const ViewTools = () => {
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCriteria, setSortCriteria] = useState('tool_name');
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
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortCriteria(e.target.value);
    };

    const filteredTools = tools.filter(tool =>
        tool.tool_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.tool_model.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <Header />
            <main>
                <h1>A makerspace ignites innovation, offering an environment full with tools</h1>
                <p>Explore all of the makerspace's tools</p>
                <div className="search-sort-container">
                    <input
                        type="text"
                        placeholder="Enter a tool's name"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-bar"
                    />
                    <div className="sort-wrapper">
                        <select value={sortCriteria} onChange={handleSortChange} className="sort-dropdown">
                            <option value="tool_name">Sort By</option>
                            <option value="tool_category">Category</option>
                            <option value="tool_location">Location</option>
                        </select>
                        <span className="search-icon">🔍</span>
                    </div>
                </div>
                <div className="tools-grid">
                    {filteredTools.map((tool, index) => (
                        <div className="tool-card" key={index}>
                            <div className="tool-image">
                                {/* Placeholder for tool image */}
                            </div>
                            <div className="tool-info">
                                <h3>{tool.tool_name}</h3>
                                <p>{tool.tool_model}</p>
                                <p className="placeholder-text">Placeholder Text</p>
                                <a href={`/tool/${tool._id}`} className="learn-more">Learn More &gt;&gt;</a>
                            </div>
                            <div className="tool-status">
                                {tool.status === 'warning' && <span className="status-icon warning">⚠️</span>}
                                {tool.status === 'good' && <span className="status-icon good">👍</span>}
                                {tool.status === 'unavailable' && <span className="status-icon unavailable">⛔</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ViewTools;