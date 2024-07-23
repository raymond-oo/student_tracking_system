import React from 'react';
import '../styles/RespectiveTool.css';

const RespectiveTool = ({ tool }) => {
    return (
        <div className="tool-profile">
            <div className="tool-header">
                <h1>{tool.tool_name}</h1>
                <h2>Model: {tool.model_number}</h2>
                <h3>Category: {tool.category}</h3>
                <p><strong>Restriction Notice:</strong> {tool.restriction_notice}</p>
                <p><strong>Location:</strong> {tool.location}</p>
            </div>
            <div className="tool-description">
                <p>{tool.description}</p>
            </div>
            <div className="tool-instructions">
                <h2>Instructions</h2>
                <p>{tool.instructions}</p>
            </div>
        </div>
    );
};

export default RespectiveTool;