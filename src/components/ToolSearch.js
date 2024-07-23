import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/ToolSearch.css';

const ToolSearch = ({ tools, onAddTool, onRemoveTool }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const searchTools = async () => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        try {
          const response = await axios.get(`${API_URL}/api/tools/search?term=${searchTerm}`, {
            headers: {
              'Authorization': localStorage.getItem('sessionToken')
            }
          });
          setSearchResults(response.data);
        } catch (error) {
          console.error('Error searching tools:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    const debounce = setTimeout(searchTools, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddTool = (tool) => {
    onAddTool(tool);
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className="tool-search">
      <h3>Tools Trained:</h3>
      <div className="tools-list">
        {tools.map((tool, index) => (
          <div key={index} className="tool-item">
            <span>{tool.tool_name}</span>
            <span>{tool.tool_model}</span>
            <span>{tool.tool_category}</span>
            <button onClick={() => onRemoveTool(tool.tool_id)} className="remove-btn">Remove</button>
          </div>
        ))}
      </div>
      <div className="search-container" ref={searchRef}>
        <input
          type="text"
          placeholder="Search for tool"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {isSearching && <div className="loading">Searching...</div>}
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((tool) => (
              <div key={tool._id} className="search-result-item" onClick={() => handleAddTool(tool)}>
                <span className="tool-name">{tool.tool_name}</span>
                <span className="tool-model">{tool.tool_model}</span>
                <span className="tool-category">{tool.tool_category}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolSearch;