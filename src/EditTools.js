import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Header from './components/Header';
import './styles/EditTools.css';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmationModal from './components/ConfirmationModal';

const EditTools = () => {
    const [tools, setTools] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCriteria, setSortCriteria] = useState('tool_name');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toolToDelete, setToolToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/tools`, {
                    headers: {
                        'Authorization': localStorage.getItem('sessionToken')
                    }
                });
                setTools(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchData();
    }, [API_URL]);

    const handleAddItem = () => {
        navigate('/add-tool');
    };

    const handleUpdate = (id) => {
        navigate(`/update-tool/${id}`);
    };

    const handleDelete = (id) => {
        setToolToDelete(id);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${API_URL}/api/tools/${toolToDelete}`, {
                headers: {
                    'Authorization': localStorage.getItem('sessionToken')
                }
            });
            setTools(tools.filter(tool => tool._id !== toolToDelete));
            toast.success('Tool deleted successfully!');
            setIsModalOpen(false);
            setToolToDelete(null);
            await new Promise(resolve => setTimeout(resolve, 1000));
            window.location.reload();

        } catch (err) {
            setError(err);
            toast.error(err.message);
            setIsModalOpen(false);
            setToolToDelete(null);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSortChange = (value) => {
        setSortCriteria(value);
        sortItems(value, tools);
    };

    const sortItems = useCallback((criteria, itemsList) => {
        let sortedItems;
        if (criteria === 'tool_name') {
            sortedItems = [...itemsList].sort((a, b) =>
                a.tool_name.localeCompare(b.tool_name)
            );
        } else if (criteria === 'category') {
            sortedItems = [...itemsList].sort((a, b) =>
                a.tool_category.localeCompare(b.tool_category)
            );
        }
        setTools(sortedItems);
    }, []);

    useEffect(() => {
        if (tools?.length > 0) {
            sortItems(sortCriteria, tools);
        }
    }, [tools, sortCriteria, sortItems]);

    const filteredItems = tools?.filter(
        (item) =>
            item.tool_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.tool_category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.tool_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${item.tool_id}`.includes(searchTerm.toLowerCase())
    ) || [];

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <Header />
            <div className="edit-tools-container">
                <div className="controls-container">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    <select value={sortCriteria} onChange={handleSortChange} className="sort-dropdown">
                        <option value="tool_name">Sort By: Tool Name A → Z</option>
                        <option value="category">Sort By: Category</option>
                    </select>
                    <button className="add-item-button" onClick={handleAddItem}>
                        Add a new tool
                    </button>
                    <button className="navigate-button" onClick={() => navigate('/edit-students')}>
                        Edit Students
                    </button>
                </div>
                <table className="items-table">
                    <thead>
                        <tr>
                            <th>Tool ID</th>
                            <th>Tool Name</th>
                            <th>Tool Category</th>
                            <th>Tool Location</th>
                            <th>Trained Students</th>
                            <th>Update Tool</th>
                            <th>Remove Tool</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map((item) => (
                            <tr key={item._id}>
                                <td>{item.tool_id}</td>
                                <td>{item.tool_name}</td>
                                <td>{item.tool_category}</td>
                                <td>{item.tool_location}</td>
                                <td>{item.list_of_trained_students.join(', ')}</td>
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

export default EditTools;
