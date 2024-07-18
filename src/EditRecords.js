import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Header from './components/Header';
import './styles/EditRecords.css';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmationModal from './components/ConfirmationModal';

const EditRecords = () => {
    const [students, setStudents] = useState([]);
    const [tools, setTools] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCriteria, setSortCriteria] = useState('lastname');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTab, setSelectedTab] = useState('students');
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const studentsResponse = await axios.get(`${API_URL}/api/students`, {
                    headers: {
                        'Authorization': localStorage.getItem('sessionToken')
                    }
                });
                const toolsResponse = await axios.get(`${API_URL}/api/tools`, {
                    headers: {
                        'Authorization': localStorage.getItem('sessionToken')
                    }
                });
                setStudents(studentsResponse.data);
                setTools(toolsResponse.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchData();
    }, [API_URL]);

    const handleAddItem = () => {
        navigate(selectedTab === 'students' ? '/add-student' : '/add-tool');
    };

    const handleUpdate = (id) => {
        navigate(selectedTab === 'students' ? `/update-student/${id}` : `/update-tool/${id}`);
    };

    const handleDelete = (id) => {
        setItemToDelete(id);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${API_URL}/api/${selectedTab}/${itemToDelete}`, {
                headers: {
                    'Authorization': localStorage.getItem('sessionToken')
                }
            });
            if (selectedTab === 'students') {
                setStudents(students.filter(student => student._id !== itemToDelete));
            } else {
                setTools(tools.filter(tool => tool._id !== itemToDelete));
            }
            toast.success(`${selectedTab === 'students' ? 'Student' : 'Tool'} deleted successfully!`);
            setIsModalOpen(false);
            setItemToDelete(null);
        } catch (err) {
            setError(err);
            toast.error(err.message);
            setIsModalOpen(false);
            setItemToDelete(null);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSortChange = (value) => {
        setSortCriteria(value);
        sortItems(value, selectedTab === 'students' ? students : tools);
    };

    const sortItems = useCallback((criteria, itemsList) => {
        let sortedItems;
        if (selectedTab === 'students') {
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
        } else {
            if (criteria === 'tool_name') {
                sortedItems = [...itemsList].sort((a, b) =>
                    a.tool_name.localeCompare(b.tool_name)
                );
            } else if (criteria === 'category') {
                sortedItems = [...itemsList].sort((a, b) =>
                    a.category.localeCompare(b.category)
                );
            }
        }
        selectedTab === 'students' ? setStudents(sortedItems) : setTools(sortedItems);
    }, [selectedTab]);

    useEffect(() => {
        if (selectedTab === 'students' ? students.length > 0 : tools.length > 0) {
            sortItems(sortCriteria, selectedTab === 'students' ? students : tools);
        }
    }, [students, tools, sortCriteria, sortItems, selectedTab]);

    const filteredItems = (selectedTab === 'students' ? students : tools).filter(
        (item) => selectedTab === 'students' ?
            (`${item.first_name} ${item.last_name}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                `${item.grade}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${item.list_of_trained_tools}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                `${item.user_id}`.includes(searchTerm.toLowerCase())) :
            (item.tool_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <Header />
            <div className="edit-records-container">
                <div className="tab-container">
                    <button
                        className={`tab ${selectedTab === 'students' ? 'selected' : ''}`}
                        onClick={() => setSelectedTab('students')}
                    >
                        Students
                    </button>
                    <button
                        className={`tab ${selectedTab === 'tools' ? 'selected' : ''}`}
                        onClick={() => setSelectedTab('tools')}
                    >
                        Tools
                    </button>
                </div>
                <div className="controls-container">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    <select value={sortCriteria} onChange={handleSortChange} className="sort-dropdown">
                        {selectedTab === 'students' ? (
                            <>
                                <option value="lastname">Sort By: Last Name A → Z</option>
                                <option value="firstname">Sort By: First Name A → Z</option>
                                <option value="grade">Sort By: Grade Level</option>
                            </>
                        ) : (
                            <>
                                <option value="tool_name">Sort By: Tool Name A → Z</option>
                                <option value="category">Sort By: Category</option>
                            </>
                        )}
                    </select>
                    <button className="add-item-button" onClick={handleAddItem}>
                        {selectedTab === 'students' ? 'Add a new student' : 'Add a new tool'}
                    </button>
                </div>
                <table className="items-table">
                    <thead>
                        <tr>
                            {selectedTab === 'students' ? (
                                <>
                                    <th>Student ID</th>
                                    <th>Student Name</th>
                                    <th>Grade Level</th>
                                    <th>List of Tools/Experience</th>
                                    <th>Update Student</th>
                                    <th>Remove Student</th>
                                </>
                            ) : (
                                <>
                                    <th>Tool Name</th>
                                    <th>Category</th>
                                    <th>Location</th>
                                    <th>Update Tool</th>
                                    <th>Remove Tool</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map((item) => (
                            <tr key={item._id}>
                                {selectedTab === 'students' ? (
                                    <>
                                        <td>{item.user_id}</td>
                                        <td>{`${item.first_name} ${item.last_name}`}</td>
                                        <td>{item.grade}</td>
                                        <td>{item.list_of_trained_tools.join(', ')}</td>
                                        <td><button className="update-button" onClick={() => handleUpdate(item._id)}>Update</button></td>
                                        <td><button className="delete-button" onClick={() => handleDelete(item._id)}>Delete</button></td>
                                    </>
                                ) : (
                                    <>
                                        <td>{item.tool_name}</td>
                                        <td>{item.category}</td>
                                        <td>{item.location}</td>
                                        <td><button className="update-button" onClick={() => handleUpdate(item._id)}>Update</button></td>
                                        <td><button className="delete-button" onClick={() => handleDelete(item._id)}>Delete</button></td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                message={`Are you sure you want to delete this ${selectedTab.slice(0, -1)}?`}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    );
};

export default EditRecords;