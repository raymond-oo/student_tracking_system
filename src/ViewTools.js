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

    const handleViewMore = (toolId) => {
        navigate(`/tool/${toolId}`);
    };

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
        const criteria = e.target.value;
        setSortCriteria(criteria);
        sortTools(criteria, tools);
    };

    const sortTools = useCallback((criteria, toolsList) => {
        let sortedTools;
        if (criteria === 'tool_name') {
            sortedTools = [...toolsList].sort((a, b) => a.tool_name.localeCompare(b.tool_name));
        } else if (criteria === 'tool_category') {
            sortedTools = [...toolsList].sort((a, b) => a.tool_category.localeCompare(b.tool_category));
        } else if (criteria === 'tool_location') {
            sortedTools = [...toolsList].sort((a, b) => a.tool_location.localeCompare(b.tool_location));
        }
        setTools(sortedTools);
    }, []);

    useEffect(() => {
        if (tools.length > 0) {
            sortTools(sortCriteria, tools);
        }
    }, [tools, sortCriteria, sortTools]);

    const filteredTools = tools.filter(tool =>
        tool.tool_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.tool_model.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <Header />
            <div className="tools-container">
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
                    <select value={sortCriteria} onChange={handleSortChange} className="sort-dropdown">
                        <option value="tool_name">Sort By: Name A → Z</option>
                        <option value="tool_category">Sort By: Category</option>
                        <option value="tool_location">Sort By: Location</option>
                    </select>
                </div>
                <div className="tools-grid">
                    {filteredTools.map((tool, index) => (
                        <div className="tool-card" key={index}>
                            <div className="tool-card-header">
                                <div className="tool-image">
                                    {/* Placeholder for tool image */}
                                </div>
                                <button onClick={() => handleViewMore(tool._id)} className="view-more-btn">{'>'} View More</button>
                            </div>
                            <div className="tool-info">
                                <h3>{tool.tool_name}</h3>
                                <p>{tool.tool_model}</p>
                                <p className="placeholder-text">Placeholder Text</p>
                            </div>
                            <div className="tool-status">
                                {tool.status === 'warning' && <span className="status-icon warning">⚠️</span>}
                                {tool.status === 'good' && <span className="status-icon good">👍</span>}
                                {tool.status === 'unavailable' && <span className="status-icon unavailable">⛔</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewTools;
