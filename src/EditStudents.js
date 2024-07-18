import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Header from './components/Header';
import './styles/EditStudents.css';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmationModal from './components/ConfirmationModal';

const EditStudents = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCriteria, setSortCriteria] = useState('lastname');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/students`, {
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

        fetchData();
    }, [API_URL]);

    const handleAddItem = () => {
        navigate('/add-student');
    };

    const handleUpdate = (id) => {
        navigate(`/update-student/${id}`);
    };

    const handleDelete = (id) => {
        setStudentToDelete(id);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
          await axios.delete(`${API_URL}/api/students/${studentToDelete}`, {
            headers: {
              'Authorization': localStorage.getItem('sessionToken')
            }
          });
          setStudents(students.filter(student => student._id !== studentToDelete));
          toast.success('Student deleted successfully!')
          setIsModalOpen(false);
          setStudentToDelete(null);
          await new Promise(resolve => setTimeout(resolve, 1000));
          window.location.reload();
    
        } catch (err) {
          setError(err);
          toast.error(err.message);
          setIsModalOpen(false);
          setStudentToDelete(null);
        }
      };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSortChange = (value) => {
        setSortCriteria(value);
        sortItems(value, students);
    };

    const sortItems = useCallback((criteria, itemsList) => {
        let sortedItems;
        if (criteria === 'lastname') {
            sortedItems = [...itemsList].sort((a, b) =>
                a.last_name.localeCompare(b.last_name)
            );
        } else if (criteria === 'firstname') {
            sortedItems = [...itemsList].sort((a, b) =>
                a.first_name.localeCompare(b.first_name)
            );
        } else if (criteria === 'grade') {
            sortedItems = [...itemsList].sort((a, b) => b.grade - a.grade);
        }
        setStudents(sortedItems);
    }, []);

    useEffect(() => {
        if (students?.length > 0) {
            sortItems(sortCriteria, students);
        }
    }, [students, sortCriteria, sortItems]);

    const filteredItems = students?.filter(
        (item) =>
            `${item.first_name} ${item.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${item.grade}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${item.list_of_trained_tools}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${item.user_id}`.includes(searchTerm.toLowerCase())
    ) || [];

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <Header />
            <div className="edit-students-container">
                <div className="controls-container">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    <select value={sortCriteria} onChange={handleSortChange} className="sort-dropdown">
                        <option value="lastname">Sort By: Last Name A → Z</option>
                        <option value="firstname">Sort By: First Name A → Z</option>
                        <option value="grade">Sort By: Grade Level</option>
                    </select>
                    <button className="add-item-button" onClick={handleAddItem}>
                        Add a new student
                    </button>
                    <button className="navigate-button" onClick={() => navigate('/edit-tools')}>
                        Edit Tools
                    </button>
                </div>
                <table className="items-table">
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
                        {filteredItems.map((item) => (
                            <tr key={item._id}>
                                <td>{item.user_id}</td>
                                <td>{`${item.first_name} ${item.last_name}`}</td>
                                <td>{item.grade}</td>
                                <td>{item.list_of_trained_tools.join(', ')}</td>
                                <td><button className="update-button" onClick={() => handleUpdate(item._id)}>Update</button></td>
                                <td><button className="delete-button" onClick={() => handleDelete(item._id)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {isModalOpen && (
                    <ConfirmationModal
                        onConfirm={confirmDelete}
                        onCancel={() => setIsModalOpen(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default EditStudents;
