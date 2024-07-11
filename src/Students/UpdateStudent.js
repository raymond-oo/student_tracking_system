import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import toast from 'react-hot-toast';
// import '../styles/UpdateStudent.css';

const UpdateStudent = () => {
    const [student, setStudent] = useState({
        first_name: '',
        last_name: '',
        email: '',
        grade: '',
        list_of_trained_tools: []
    });
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

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

    return (
        <div>
            <Header />
            <div className="update-student-container">
                <h2>Update Student</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" name="first_name" value={student.first_name} onChange={handleChange} required />
                    <input type="text" name="last_name" value={student.last_name} onChange={handleChange} required />
                    <input type="email" name="email" value={student.email} onChange={handleChange} required />
                    <input type="text" name="grade" value={student.grade} onChange={handleChange} required />
                    <input type="text" name="list_of_trained_tools" value={student.list_of_trained_tools.join(',')} onChange={handleChange} />
                    <button type="submit">Update Student</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateStudent;