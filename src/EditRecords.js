import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import './styles/EditRecords.css';
import { useNavigate } from 'react-router-dom';

const EditRecords = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/students', {
                    headers: {
                        'Authorization': localStorage.getItem('sessionToken')
                    }
                });
                setStudents(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const handleAddStudent = () => {
        navigate('/add-student');
    };

    const handleUpdate = (id) => {
        navigate(`/update-student/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5001/api/students/${id}`, {
                headers: {
                    'Authorization': localStorage.getItem('sessionToken')
                }
            });
            setStudents(students.filter(student => student._id !== id));
        } catch (err) {
            setError(err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <Header />
            <div className="edit-records-container">
                <div className="tab-container">
                    <button className="tab selected">Students</button>
                    <button className="tab">Tools</button>
                </div>
                <button className="add-student-button" onClick={handleAddStudent}>Add a new student</button>
                <table className="students-table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Grade Level</th>
                            <th>List of Tools/Experience</th>
                            <th>Update Student</th>
                            <th>Remove Student</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student._id}>
                                <td>{student.user_id}</td>
                                <td>{`${student.first_name} ${student.last_name}`}</td>
                                <td>{student.grade}</td>
                                <td>{student.list_of_trained_tools.join(', ')}</td>
                                <td><button className="update-button" onClick={() => handleUpdate(student._id)}>Update</button></td>
                                <td><button className="delete-button" onClick={() => handleDelete(student._id)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EditRecords;
