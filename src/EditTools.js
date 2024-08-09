import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Header from './components/Header';
import './styles/EditTools.css';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmationModal from './components/ConfirmationModal';
import LoadingPage from './components/LoadingPage';

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
    const fetchTools = async () => {
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

    fetchTools();
  }, [API_URL]);

  const handleAddTool = () => {
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
      toast.success('Tool deleted successfully!', {
        iconTheme: {
            primary: '#333',
            secondary: '#DCB41F',
        },
        style: {
            backgroundColor: '#333',
            color: '#DCB41F',
        },
    });
    
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
    sortTools(value, tools);
  };

  const sortTools = useCallback((criteria, toolsList) => {
    let sortedTools;
    if (criteria === 'tool_name') {
      sortedTools = [...toolsList].sort((a, b) =>
        a.tool_name.localeCompare(b.tool_name)
      );
    } else if (criteria === 'tool_category') {
      sortedTools = [...toolsList].sort((a, b) =>
        a.tool_category.localeCompare(b.tool_category)
      );
    }
    setTools(sortedTools);
  }, []);

  useEffect(() => {
    if (tools.length > 0) {
      sortTools(sortCriteria, tools);
    }
  }, [tools, sortCriteria, sortTools]);

  const filteredTools = tools.filter(
    (tool) =>
      tool.tool_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.tool_model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.tool_category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.tool_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${tool.tool_id}`.includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingPage />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <Header />
      <div className="edit-records-container">
        <div className="tab-container">
          <button className="tab" onClick={() => navigate('/edit-students')}>Students</button>
          <button className="tab selected">Tools</button>
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
            <option value="tool_name">Sort By: Tool Name A → Z</option>
            <option value="tool_category">Sort By: Category</option>
          </select>
          <button className="add-tool-button" onClick={handleAddTool}>
            Add a new tool
          </button>
        </div>
        <table className="tools-table">
          <thead>
            <tr>
              <th>Tool ID</th>
              <th>Tool Name</th>
              <th>Category</th>
              <th>Location</th>
              <th>Trained Students</th>
              <th>Update Tool</th>
              <th>Remove Tool</th>
            </tr>
          </thead>
          <tbody>
            {filteredTools.map((tool) => (
              <tr key={tool._id}>
                <td>{tool.tool_id}</td>
                <td>{tool.tool_name}</td>
                <td>{tool.tool_category}</td>
                <td>{tool.tool_location}</td>
                <td>{tool.list_of_trained_students.join(', ')}</td>
                <td><button className="update-button" onClick={() => handleUpdate(tool._id)}>Update</button></td>
                <td><button className="delete-button" onClick={() => handleDelete(tool._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDelete}
          message="Are you sure you want to delete this tool?"
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default EditTools;
