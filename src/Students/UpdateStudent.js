import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import toast from 'react-hot-toast';
import ConfirmationModal from '../components/ConfirmationModal';
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
    const [originalStudent, setOriginalStudent] = useState({});
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
                setOriginalStudent(response.data);
            } catch (err) {
                setError(err.response.data.message);
            }
        };
        fetchStudent();
    }, [id, API_URL]);

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
        if (JSON.stringify(student) === JSON.stringify(originalStudent)) {
            toast.info('No changes were made');
            navigate('/edit-records');
            return;
        }
        setIsModalOpen(true);
    };

    const confirmUpdate = async () => {
        try {
            const formData = new FormData();
            for (let key in student) {
                if (key === 'list_of_trained_tools') {
                    formData.append(key, JSON.stringify(student[key]));
                } else {
                    formData.append(key, student[key]);
                }
            }

            await axios.put(`${API_URL}/api/students/${id}`, formData, {
                headers: {
                    'Authorization': localStorage.getItem('sessionToken'),
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/edit-records');
            toast.success('Student updated successfully!');
        } catch (err) {
            setError(err.response.data.message);
        }
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        navigate('/edit-records');
        toast.info('No changes were made');
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
                    <input type="file" name="profile_picture" onChange={handleChange} accept="image/*" />
                    <div className="button-group">
                        <button type="submit">Update Student</button>
                        <button type="button" onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmUpdate}
                message="Are you sure you want to update this student?"
                confirmText="Update"
                cancelText="Cancel"
            />
        </div>
    );
};

export default UpdateStudent;