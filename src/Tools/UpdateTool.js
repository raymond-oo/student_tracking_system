import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import toast from 'react-hot-toast';
import '../styles/UpdateTool.css';

const UpdateTool = () => {
    const [tool, setTool] = useState({
        tool_name: '',
        tool_model: '',
        tool_location: '',
        tool_category: '',
        imageUrl: '',
        restriction_id: ''
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
                setError(err.response ? err.response.data.message : 'Error fetching tool data');
            }
        };
        fetchTool();
    }, [id]);

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
            navigate(`/tool${id}`);
            toast.success('Tool updated successfully!', {
                iconTheme: {
                    primary: '#333',
                    secondary: '#DCB41F',
                },
                style: {
                    backgroundColor: '#333',
                    color: '#DCB41F',
                },
            });

        } catch (err) {
            setError(err.response ? err.response.data.message : 'Error updating tool');
            toast.error('Error updating tool', {
                iconTheme: {
                    primary: '#FFFFFF',
                    secondary: '#E61920',
                },
                style: {
                    backgroundColor: '#E61920',
                    color: '#FFFFFF',
                },
            });
        }
    };

    const handleCancel = () => {
        navigate('/edit-tools');
        toast('No changes were made.', {
            iconTheme: {
                primary: '#333',
                secondary: '#DCB41F',
            },
            style: {
                backgroundColor: '#333',
                color: '#DCB41F',
            },
        });
    };

    return (
        <div>
            <Header />
            <div className="update-tool-container">
                <h2>Update Tool</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input placeholder="Tool Name" type="text" name="tool_name" value={tool.tool_name} onChange={handleChange} required />
                    <input placeholder="Tool Model" type="text" name="tool_model" value={tool.tool_model} onChange={handleChange} required />
                    <input placeholder="Tool Location" type="text" name="tool_location" value={tool.tool_location} onChange={handleChange} required />
                    <input placeholder="Tool Category" type="text" name="tool_category" value={tool.tool_category} onChange={handleChange} required />
                    <input placeholder="Image URL" type="text" name="imageUrl" value={tool.imageUrl} onChange={handleChange} required />
                    <input placeholder="Restriction ID" type="number" name="restriction_id" value={tool.restriction_id} onChange={handleChange} required />
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
