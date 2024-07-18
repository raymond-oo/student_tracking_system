import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import toast from 'react-hot-toast';
import '../styles/AddStudent.css';

const AddStudent = () => {
    const [student, setStudent] = useState({
        user_id: '',
        first_name: '',
        last_name: '',
        email: '',
        grade: '',
        list_of_trained_tools: [],
        profile_picture: null
    });
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
                    'Authorization': localStorage.getItem('sessionToken'),
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

    return (
        <div>
            <Header />
            <div className="add-student-container">
                <h2>Add New Student</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="user_id">User ID (optional):</label>
                            <input
                                type="text"
                                id="user_id"
                                name="user_id"
                                value={student.user_id}
                                onChange={handleChange}
                            />
                        </div>
                    <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} required />
                    <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    <input type="text" name="grade" placeholder="Grade" onChange={handleChange} required />
                    <input type="text" name="list_of_trained_tools" placeholder="Trained Tools (comma separated)" onChange={handleChange} />
                    <input type="file" name="profile_picture" onChange={handleChange} accept="image/*" />
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
