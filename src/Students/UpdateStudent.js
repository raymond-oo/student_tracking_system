import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
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
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
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

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/tools/search`, {
                params: { query: searchQuery },
                headers: {
                    'Authorization': localStorage.getItem('sessionToken')
                }
            });
            setSearchResults(response.data);
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    const handleAddTool = (tool) => {
        setStudent((prevState) => ({
            ...prevState,
            list_of_trained_tools: [...prevState.list_of_trained_tools, tool]
        }));
    };

    const handleChange = (e) => {
        if (e.target.name === 'profile_picture') {
            setStudent({ ...student, [e.target.name]: e.target.files[0] });
        } else {
            setStudent({ ...student, [e.target.name]: e.target.value });
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

    return (
        <div>
            <Header />
            <div className="update-student-container">
                <h2>Update Student</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input placeholder="First Name" type="text" name="first_name" value={student.first_name} onChange={handleChange} required />
                    <input placeholder="Last Name" type="text" name="last_name" value={student.last_name} onChange={handleChange} required />
                    <input placeholder="example@isyedu.org" type="email" name="email" value={student.email} onChange={handleChange} required />
                    <input placeholder="Grade" type="text" name="grade" value={student.grade} onChange={handleChange} required />
                    <input placeholder="Profile Picture" type="file" name="profile_picture" onChange={handleChange} accept="image/*" />
                    
                    {/* Search for tools */}
                    <input 
                        placeholder="Search Tools" 
                        type="text" 
                        value={searchQuery} 
                        onChange={handleSearchChange} 
                    />
                    <button type="button" onClick={handleSearch}>Search</button>

                    {/* Display search results */}
                    <div>
                        {searchResults.map((tool) => (
                            <div key={tool._id}>
                                <span>{tool.tool_name}</span>
                                <button type="button" onClick={() => handleAddTool(tool)}>Add</button>
                            </div>
                        ))}
                    </div>

                    {/* Display list of trained tools */}
                    <div>
                        <h3>Trained Tools</h3>
                        {student.list_of_trained_tools.map((tool, index) => (
                            <div key={index}>
                                <span>{tool.tool_name}</span>
                            </div>
                        ))}
                    </div>

                    <div className="button-group">
                        <button type="submit">Update Student</button>
                        <button type="button" onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateStudent;
