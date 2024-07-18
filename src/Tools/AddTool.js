import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import toast from 'react-hot-toast';
import '../styles/AddTool.css';

const AddTool = () => {
    const [tool, setTool] = useState({
        tool_name: '',
        tool_model: '',
        tool_location: '',
        tool_category: '',
        imageUrl: '',
        restriction_id: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    const handleChange = (e) => {
        setTool({ ...tool, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/tools`, tool, {
                headers: {
                    'Authorization': localStorage.getItem('sessionToken'),
                }
            });
            navigate('/edit-tools');
            toast.success('Tool added successfully!');
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Error adding tool');
            toast.error('Error adding tool');
        }
    };

    const handleCancel = () => {
        navigate('/edit-tools');
        toast('No changes were made.');
    };

    return (
        <div>
            <Header />
            <div className="add-tool-container">
                <h2>Add New Tool</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" name="tool_name" placeholder="Tool Name" onChange={handleChange} required />
                    <input type="text" name="tool_model" placeholder="Tool Model" onChange={handleChange} required />
                    <input type="text" name="tool_location" placeholder="Tool Location" onChange={handleChange} required />
                    <input type="text" name="tool_category" placeholder="Tool Category" onChange={handleChange} required />
                    <input type="text" name="imageUrl" placeholder="Image URL" onChange={handleChange} required />
                    <input type="number" name="restriction_id" placeholder="Restriction ID" onChange={handleChange} required />
                    <div className="button-group">
                        <button type="submit">Add Tool</button>
                        <button type="button" onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTool;
