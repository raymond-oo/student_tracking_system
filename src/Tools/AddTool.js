import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import toast from 'react-hot-toast';
import '../styles/AddTool.css';

const AddTool = () => {
    const [tool, setTool] = useState({
        tool_name: '',
        category: '',
        location: '',
        description: ''
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

            navigate('/edit-records');
            toast.success('Tool added successfully!');
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    const handleCancel = () => {
        navigate('/edit-records');
        toast('Add cancelled.');
    };

    return (
        <div>
            <Header />
            <div className="add-tool-container">
                <h2>Add New Tool</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" name="tool_name" placeholder="Tool Name" onChange={handleChange} required />
                    <input type="text" name="category" placeholder="Category" onChange={handleChange} required />
                    <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
                    <textarea name="description" placeholder="Description" onChange={handleChange}></textarea>
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
