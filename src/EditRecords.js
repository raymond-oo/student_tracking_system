import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import './design/EditRecords.css';

const EditRecords = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                <button className="add-student-button">Add a new student</button>
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
                            <tr key={student.user_id}>
                                <td>{student.user_id}</td>
                                <td>{`${student.first_name} ${student.last_name}`}</td>
                                <td>{student.grade}</td>
                                <td>{student.list_of_trained_tools.join(', ')}</td>
                                <td><button className="update-button">Update</button></td>
                                <td><button className="delete-button">Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EditRecords;
