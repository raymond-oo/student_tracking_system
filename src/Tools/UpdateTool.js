import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import toast from 'react-hot-toast';
import '../styles/UpdateTool.css';

const UpdateTool = () => {
    const [tool, setTool] = useState({
        tool_name: '',
        category: '',
        location: '',
        description: ''
    });

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
            } catch (err) {
                setError(err.response.data.message);
            }
        };
        fetchTool();
    }, [id, API_URL]);

    const handleChange = (e) => {
        setTool({ ...tool, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_URL}/api/tools/${id}`, tool, {
                headers: {
                    'Authorization': localStorage.getItem('sessionToken')
                }
            });
            navigate(`/tool/${id}`);
            toast.success('Tool updated successfully!');
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    const handleCancel = () => {
        navigate('/edit-records');
        toast('No changes were made');
    };

    return (
        <div>
            <Header />
            <div className="update-tool-container">
                <h2>Update Tool</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input placeholder="Tool Name" type="text" name="tool_name" value={tool.tool_name} onChange={handleChange} required />
                    <input placeholder="Category" type="text" name="category" value={tool.category} onChange={handleChange} required />
                    <input placeholder="Location" type="text" name="location" value={tool.location} onChange={handleChange} required />
                    <textarea placeholder="Description" name="description" value={tool.description} onChange={handleChange}></textarea>
                    <div className="button-group">
                        <button type="submit">Update Tool</button>
                        <button type="button" onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateTool;
