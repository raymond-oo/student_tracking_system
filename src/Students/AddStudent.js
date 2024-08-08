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
        profile_picture: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    const handleChange = async (e) => {
        if (e.target.name === 'profile_picture') {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('file', file);
    
            try {
                // Upload the file to your server
                const response = await axios.post(`${API_URL}/api/upload`, formData, {
                    headers: {
                        'Authorization': localStorage.getItem('sessionToken'),
                        'Content-Type': 'multipart/form-data'
                    }
                });
                
                // Use the URL returned by the server
                const imageUrl = response.data.url;
                setStudent({ ...student, profile_picture: imageUrl });
            } catch (error) {
                console.error('File upload failed:', error);
                setError('File upload failed');
            }
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
            setError(err.response?.data?.message || err.message);
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
                    <input type="text" name="user_id" placeholder="User ID (optional)" onChange={handleChange} />
                    <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} required />
                    <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    <input type="text" name="grade" placeholder="Grade" onChange={handleChange} required />
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
