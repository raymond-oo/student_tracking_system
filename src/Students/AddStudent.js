import React, { useState } from 'react';
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
        profile_picture: null,
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    const handleChange = (e) => {
        if (e.target.name === 'profile_picture') {
            setStudent({ ...student, [e.target.name]: e.target.files[0] });
        } else {
            setStudent({ ...student, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare FormData object
        const formData = new FormData();
        formData.append('user_id', student.user_id);
        formData.append('first_name', student.first_name);
        formData.append('last_name', student.last_name);
        formData.append('email', student.email);
        formData.append('grade', student.grade);
        if (student.profile_picture) {
            formData.append('profile_picture', student.profile_picture);
        }

        try {
            await axios.post(`${API_URL}/api/students`, formData, {
                headers: {
                    'Authorization': localStorage.getItem('sessionToken'),
                    'Content-Type': 'multipart/form-data', // Set the correct Content-Type
                },
            });
            navigate('/edit-students');
            toast.success('Student added successfully!', {
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
            setError(err.response.data.message);
        }
    };

    const handleCancel = () => {
        navigate('/edit-students');
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
            <div className="add-student-container">
                <h2>Add New Student</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="user_id"
                        placeholder="User ID (optional)"
                        onChange={handleChange}
                        value={student.user_id}
                    />
                    <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        onChange={handleChange}
                        value={student.first_name}
                        required
                    />
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        onChange={handleChange}
                        value={student.last_name}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        value={student.email}
                        required
                    />
                    <input
                        type="text"
                        name="grade"
                        placeholder="Grade"
                        onChange={handleChange}
                        value={student.grade}
                        required
                    />
                    <input
                        type="file"
                        name="profile_picture"
                        onChange={handleChange}
                        accept="image/*"
                    />
                    <div className="button-group">
                        <button type="submit">Add Student</button>
                        <button type="button" onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudent;
