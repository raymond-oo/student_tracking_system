import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ConfirmationModal from '../components/ConfirmationModal';
import toast from 'react-hot-toast';
import '../styles/UpdateStudent.css';

const UpdateStudent = () => {
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toolToRemove, setToolToRemove] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/students/${id}`, {
                    headers: {
                        'Authorization': localStorage.getItem('sessionToken')
                    }
                });
                setStudent(response.data);
            } catch (err) {
                setError(err.response.data.message);
            }
        };
        fetchStudent();
    }, [id]);

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

    const handleChange = (e) => {
        if (e.target.name === 'list_of_trained_tools') {
            setStudent({...student, [e.target.name]: e.target.value.split(',')});
        } else if (e.target.name === 'profile_picture') {
            setStudent({...student, [e.target.name]: e.target.files[0]});
        } else {
            setStudent({...student, [e.target.name]: e.target.value});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_URL}/api/students/${id}`, student, {
                headers: {
                    'Authorization': localStorage.getItem('sessionToken')
                }
            });
            navigate(`/student/${id}`);
            toast.success('Student updated successfully!');
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    const handleCancel = () => {
        navigate('/edit-students');
        toast('No changes were made.');
    };

    const handleAddTool = (tool) => {
        const alreadyAdded = student.list_of_trained_tools.some(t => t.tool_id === tool.tool_id);
        if (alreadyAdded) {
            toast.error('Tool has already been added.');
        } else {
            setStudent(prevState => ({
                ...prevState,
                list_of_trained_tools: [...prevState.list_of_trained_tools, {
                    tool_id: tool.tool_id,
                    tool_name: tool.tool_name,
                    tool_model: tool.tool_model,
                    tool_category: tool.tool_category
                }]
            }));
        }
    };

    const handleRemoveTool = (tool) => {
        setToolToRemove(tool);
        setIsModalOpen(true);
    };

    const confirmRemoveTool = () => {
        setStudent(prevState => ({
            ...prevState,
            list_of_trained_tools: prevState.list_of_trained_tools.filter(t => t.tool_id !== toolToRemove.tool_id)
        }));
        setIsModalOpen(false);
        setToolToRemove(null);
        toast.success('Tool removed successfully.');
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setToolToRemove(null);
    };

    return (
        <div>
            <Header />
            <div className="update-student-container">
                <h2>Update Student</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input placeholder="User ID" type="text" name="user_id" value={student.user_id} onChange={handleChange} required />
                    <input placeholder="First Name" type="text" name="first_name" value={student.first_name} onChange={handleChange} required />
                    <input placeholder="Last Name" type="text" name="last_name" value={student.last_name} onChange={handleChange} required />
                    <input placeholder="example@isyedu.org" type="email" name="email" value={student.email} onChange={handleChange} required />
                    <input placeholder="Grade" type="text" name="grade" value={student.grade} onChange={handleChange} required />
                    <input placeholder="Profile Picture" type="file" name="profile_picture" onChange={handleChange} accept="image/*" />
                    <div className="trained-tools">
                        <h3>Tools Trained:</h3>
                        {student.list_of_trained_tools.map(tool => (
                            <div key={tool.tool_id} className="trained-tool-item">
                                <span>{tool.tool_name}</span>
                                <span>{tool.tool_model}</span>
                                <span>{tool.tool_category}</span>
                                <button type="button" className="remove-button" onClick={() => handleRemoveTool(tool)}>Remove</button>
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
                                    <button type="button" className="add-button" onClick={() => handleAddTool(tool)}>Add</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="button-group">
                        <button type="submit">Update Student</button>
                        <button type="button" onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={confirmRemoveTool}
                message="Are you sure you want to remove this tool?"
                confirmText="Confirm"
                cancelText="Cancel"
            />
        </div>
    );
};

export default UpdateStudent;
