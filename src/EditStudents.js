import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Header from './components/Header';
import './styles/EditStudents.css';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmationModal from './components/ConfirmationModal';
import LoadingPage from './components/LoadingPage';

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
    const fetchStudents = async () => {
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

    fetchStudents();
  }, [API_URL]);

  const handleAddStudent = () => {
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
      toast.success('Student deleted successfully!', {
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

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortCriteria(value);
    sortStudents(value, students);
  };

  const sortStudents = useCallback((criteria, studentsList) => {
    let sortedStudents;
    if (criteria === 'lastname') {
      sortedStudents = [...studentsList].sort((a, b) =>
        (a.last_name || '').localeCompare(b.last_name || '')
      );
    } else if (criteria === 'firstname') {
      sortedStudents = [...studentsList].sort((a, b) =>
        (a.first_name || '').localeCompare(b.first_name || '')
      );
    } else if (criteria === 'grade') {
      sortedStudents = [...studentsList].sort((a, b) => (b.grade || 0) - (a.grade || 0));
    }
    setStudents(sortedStudents);
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      sortStudents(sortCriteria, students);
    }
  }, [students, sortCriteria, sortStudents]);

  const filteredStudents = students.filter(student => {
    const fullName = `${student.first_name || ''} ${student.last_name || ''}`.toLowerCase();
    const grade = `${student.grade || ''}`.toLowerCase();
    const tools = student.list_of_trained_tools || [];

    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      grade.includes(searchTerm.toLowerCase()) ||
      tools.some(tool => tool.tool_name && tool.tool_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      `${student.user_id || ''}`.includes(searchTerm.toLowerCase())
    );
  });

  if (loading) return <LoadingPage />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <Header />
      <div className="edit-records-container">
        <div className="tab-container">
          <button className="tab selected">Students</button>
          <button className="tab" onClick={() => navigate('/edit-tools')}>Tools</button>
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
            <option value="lastname">Sort By: Last Name A → Z </option>
            <option value="firstname">Sort By: First Name A → Z </option>
            <option value="grade">Sort By: Grade Level</option>
          </select>
          <button className="add-student-button" onClick={handleAddStudent}>Add a new student</button>
        </div>
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
            {filteredStudents.map(student => (
              <tr key={student._id}>
                <td>{student.user_id}</td>
                <td>{`${student.first_name} ${student.last_name}`}</td>
                <td>{student.grade}</td>
                <td>{student.list_of_trained_tools.map(tool => tool.tool_name).join(', ')}</td>
                <td><button className="update-button" onClick={() => handleUpdate(student._id)}>Update</button></td>
                <td><button className="delete-button" onClick={() => handleDelete(student._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this student?"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default EditStudents;
