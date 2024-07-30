// components/ToolCard.js
import React from 'react';
import '../styles/ViewTools.css'
import { AiOutlineMinusCircle, AiOutlineExclamationCircle, AiOutlineLike } from "react-icons/ai";

const ToolCard = ({ tool, onViewMore }) => {
    return (
        <div className="tool-card">
            <img src={tool.imageUrl} alt={tool.tool_name} className="tool-image" />
            <div className="tool-info">
                <h3>
                    {tool.tool_name}
                    <span className={`status-icon`}>
                        {tool.restriction_id === '0' ? <AiOutlineLike alt="No adult supervision needed."/> : 
                         tool.restriction_id === '1' ? <AiOutlineExclamationCircle alt="Adult supervision needed."/> : 
                         <AiOutlineMinusCircle alt="Students may not use at all costs."/>}
                    </span>
                </h3>
                <p>{tool.tool_model}</p>
                <p className="tool-category">{tool.tool_category}</p>
            </div>
            <button onClick={() => onViewMore(tool._id)} className="view-more-btn">Learn More {'>>'}</button>
        </div>
    );
};

export default ToolCard;