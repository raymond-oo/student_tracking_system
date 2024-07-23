import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/ViewTools.css';
import Header from './components/Header';
import { AiOutlineMinusCircle } from "react-icons/ai";
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { AiOutlineLike } from "react-icons/ai";

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
    }, [API_URL]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortCriteria(e.target.value);
    };

    const sortTools = useCallback((toolsList) => {
        let sortedTools;
        if (sortCriteria === 'tool_name') {
            sortedTools = [...toolsList].sort((a, b) => a.tool_name.localeCompare(b.tool_name));
        } else if (sortCriteria === 'tool_category') {
            sortedTools = [...toolsList].sort((a, b) => a.tool_category.localeCompare(b.tool_category));
        } else if (sortCriteria === 'restriction_id') {
            sortedTools = [...toolsList].sort((a, b) => a.restriction_id - b.restriction_id);
        }
        return sortedTools;
    }, [sortCriteria]);

    useEffect(() => {
        if (tools.length > 0) {
            setTools(sortTools(tools));
        }
    }, [tools, sortTools]);

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
                <h1>A makerspace ignites innovation, offering an environment full with tools.</h1>
                <p>Explore all of the makerspace's tools, ranging from woodworking and electronics to 3D printing and crafting.</p>
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
                        <option value="restriction_id">Sort By: Restriction</option>
                    </select>
                </div>
                <div className="tools-grid">
                    {filteredTools.map((tool, index) => (
                        <div className="tool-card" key={index}>
                            <img src={tool.imageUrl} alt={tool.tool_name} className="tool-image" />
                            <div className="tool-info">
                                <h3>
                                    {tool.tool_name}
                                    <span className={`status-icon`}>
                    {tool.restriction_id === '0' ? <AiOutlineLike alt="No adult supervision needed."/> : tool.restriction_id === '1' ? <AiOutlineExclamationCircle alt="Adult supervision needed."/> : <AiOutlineMinusCircle alt="Students may not use at all costs."/>}
                </span>
            </h3>
            <p>{tool.tool_model}</p>
            <p className="tool-category">{tool.tool_category}</p>
                            </div>
                            <button onClick={() => handleViewMore(tool._id)} className="view-more-btn">Learn More {'>>'}</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewTools;
