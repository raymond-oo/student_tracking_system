import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ToolSearch.css';

const ToolSearch = ({ tools, onAddTool, onRemoveTool }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const searchTools = async () => {
      if (searchTerm) {
        try {
          const response = await axios.get(`${API_URL}/api/tools/search?term=${searchTerm}`, {
            headers: {
              'Authorization': localStorage.getItem('sessionToken')
            }
          });
          setSearchResults(response.data);
        } catch (error) {
          console.error('Error searching tools:', error);
        }
      } else {
        setSearchResults([]);
      }
    };

    const debounce = setTimeout(searchTools, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  return (
    <div className="tool-search">
      <h3>Tools Trained:</h3>
      {tools.map((tool, index) => (
        <div key={index} className="tool-item">
          <span>{tool.tool_name}</span>
          <span>{tool.tool_model}</span>
          <span>{tool.tool_category}</span>
          <button onClick={() => onRemoveTool(tool.tool_id)}>remove</button>
        </div>
      ))}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search for tool"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="search-results">
          {searchResults.map((tool) => (
            <div key={tool._id} className="search-result-item">
              <span>{tool.tool_name}</span>
              <span>{tool.tool_model}</span>
              <span>{tool.tool_category}</span>
              <button onClick={() => onAddTool(tool)}>Add</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolSearch;