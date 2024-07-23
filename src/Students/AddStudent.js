import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '../components/Header';
import toast from 'react-hot-toast';
import '../styles/AddStudent.css';

const AddStudent = () => {
    const [student, setStudent] = useState({
        first_name: '',
        last_name: '',
        email: '',
        grade: '',
        list_of_trained_tools: [],
        profile_picture: null
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    const handleChange = (e) => {
        if (e.target.name === 'list_of_trained_tools') {
            setStudent({ ...student, [e.target.name]: e.target.value.split(',') });
        } else if (e.target.name === 'profile_picture') {
            setStudent({ ...student, [e.target.name]: e.target.files[0] });
        } else {
            setStudent({ ...student, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/students`, student, {
                headers: {
                    'Authorization': localStorage.getItem('sessionToken')
                }
            });
            navigate('/edit-students');
            toast.success('Student added successfully!');
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    const handleCancel = () => {
        navigate('/edit-students');
        toast('No changes were made.');
    };

    const handleAddTool = (tool) => {
        setStudent(prevState => ({
            ...prevState,
            list_of_trained_tools: [...prevState.list_of_trained_tools, {
                tool_id: tool.tool_id,
                tool_name: tool.tool_name,
                tool_model: tool.tool_model,
                tool_category: tool.tool_category
            }]
        }));
    };

    const handleRemoveTool = (tool) => {
        setStudent(prevState => ({
            ...prevState,
            list_of_trained_tools: prevState.list_of_trained_tools.filter(t => t.tool_id !== tool.tool_id)
        }));
    };

    useEffect(() => {
        const fetchTools = async () => {
            if (searchTerm) {
                try {
                    const response = await axios.get(`${API_URL}/api/tools?search=${searchTerm}`, {
                        headers: {
                            'Authorization': localStorage.getItem('sessionToken')
                        }
                    });
                    setSearchResults(response.data);
                } catch (err) {
                    setError(err.response.data.message);
                }
            } else {
                setSearchResults([]);
            }
        };
        fetchTools();
    }, [searchTerm]);

    return (
        <div>
            <Header />
            <div className="add-student-container">
                <h2>Add New Student</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} required />
                    <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    <input type="text" name="grade" placeholder="Grade" onChange={handleChange} required />
                    <input type="file" name="profile_picture" onChange={handleChange} accept="image/*" />
                    <div className="trained-tools">
                        <h3>Tools Trained:</h3>
                        {student.list_of_trained_tools.map(tool => (
                            <div key={tool.tool_id} className="trained-tool-item">
                                <span>{tool.tool_name}</span>
                                <span>{tool.tool_model}</span>
                                <span>{tool.tool_category}</span>
                                <button onClick={() => handleRemoveTool(tool)}>Remove</button>
                            </div>
                        ))}
                    </div>
                    <div className="tool-search">
                        <input
                            type="text"
                            placeholder="Search for tools..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="tool-results">
                            {searchResults.map(tool => (
                                <div key={tool.tool_id} className="tool-item">
                                    <span>{tool.tool_name}</span>
                                    <span>{tool.tool_model}</span>
                                    <span>{tool.tool_category}</span>
                                    <button onClick={() => handleAddTool(tool)}>Add</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="button-group">
                        <button type="submit">Add Student</button>
                        <button type="button" onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudent;
