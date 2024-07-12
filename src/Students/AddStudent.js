import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import toast from 'react-hot-toast';
import ConfirmationModal from '../components/ConfirmationModal';
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
    const [isAdmin, setIsAdmin] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        checkAdminStatus();
    }, []);

    const checkAdminStatus = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/user/me`, {
                headers: {
                    'Authorization': localStorage.getItem('sessionToken')
                }
            });
            setIsAdmin(response.data.is_admin);
        } catch (err) {
            console.error('Error checking admin status:', err);
        }
    };

    const handleChange = (e) => {
        if (e.target.name === 'list_of_trained_tools') {
            setStudent({...student, [e.target.name]: e.target.value.split(',')});
        } else if (e.target.name === 'profile_picture') {
            setStudent({...student, [e.target.name]: e.target.files[0]});
        } else {
            setStudent({...student, [e.target.name]: e.target.value});
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!student.first_name || !student.last_name || !student.email) {
            setError('First name, last name, and email are required fields.');
            return;
        }
        setIsModalOpen(true);
    };

    const confirmAdd = async () => {
        try {
            const formData = new FormData();
            for (let key in student) {
                if (key === 'list_of_trained_tools') {
                    formData.append(key, JSON.stringify(student[key]));
                } else if (student[key]) { // Only append if the value is not null or empty
                    formData.append(key, student[key]);
                }
            }

            const response = await axios.post(`${API_URL}/api/students`, formData, {
                headers: {
                    'Authorization': localStorage.getItem('sessionToken'),
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if (response.data) {
                navigate('/edit-records');
                toast.success('Student added successfully!');
            } else {
                setError('Failed to add student. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while adding the student.');
        }
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        navigate('/edit-records');
        toast('Add cancelled.');
    };

    return (
        <div>
            <Header />
            <div className="add-student-container">
                <h2>Add New Student</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    {isAdmin && (
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
                    )}
                    <input type="text" name="first_name" placeholder="First Name" value={student.first_name} onChange={handleChange} required />
                    <input type="text" name="last_name" placeholder="Last Name" value={student.last_name} onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" value={student.email} onChange={handleChange} required />
                    <input type="text" name="grade" placeholder="Grade" value={student.grade} onChange={handleChange} required />
                    <input type="text" name="list_of_trained_tools" placeholder="Trained Tools (comma separated)" value={student.list_of_trained_tools.join(',')} onChange={handleChange} />
                    <input type="file" name="profile_picture" onChange={handleChange} accept="image/*" />
                    <div className="button-group">
                        <button type="submit">Add Student</button>
                        <button type="button" onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmAdd}
                message="Are you sure you want to add this student?"
                confirmText="Add"
                cancelText="Cancel"
            />
        </div>
    );
};

export default AddStudent;