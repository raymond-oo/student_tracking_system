import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import toast from 'react-hot-toast';

// import '../styles/AddStudent.css';

const AddStudent = () => {
    const [student, setStudent] = useState({
        user_id: '',
        first_name: '',
        last_name: '',
        email: '',
        grade: '',
        list_of_trained_tools: []
    });
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkAdminStatus();
    }, []);

    const checkAdminStatus = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/user/me', {
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
        } else {
            setStudent({...student, [e.target.name]: e.target.value});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/students', student, {
                headers: {
                    'Authorization': localStorage.getItem('sessionToken')
                }
            });
            navigate(`/edit-records`);
            toast.success('Student added successfully!');
        } catch (err) {
            setError(err.response.data.message);
        }
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
                    <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} required />
                    <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    <input type="text" name="grade" placeholder="Grade" onChange={handleChange} required />
                    <input type="text" name="list_of_trained_tools" placeholder="Trained Tools (comma separated)" onChange={handleChange} />
                    <button type="submit">Add Student</button>
                </form>
            </div>
        </div>
    );
};

export default AddStudent;