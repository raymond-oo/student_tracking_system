import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateStudent = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        google_id: '',
        first_name: '',
        last_name: '',
        email: '',
        grade: '',
        list_of_trained_tools: [],
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/students/${id}`, {
                    headers: {
                        'Authorization': localStorage.getItem('sessionToken')
                    }
                });
                setFormData(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchStudent();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5001/api/students/${id}`, formData, {
                headers: {
                    'Authorization': localStorage.getItem('sessionToken')
                },
            });
            navigate('/edit-records');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Update Student</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Google ID:
                    <input type="text" name="google_id" value={formData.google_id} onChange={handleChange} required />
                </label>
                <label>
                    First Name:
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
                </label>
                <label>
                    Last Name:
                    <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </label>
                <label>
                    Grade:
                    <input type="text" name="grade" value={formData.grade} onChange={handleChange} />
                </label>
                <label>
                    List of Trained Tools:
                    <input type="text" name="list_of_trained_tools" value={formData.list_of_trained_tools} onChange={handleChange} />
                </label>
                <button type="submit">Update Student</button>
            </form>
        </div>
    );
};

export default UpdateStudent;
