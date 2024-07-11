import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Header from './components/Header';
import './styles/EditRecords.css';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Input, Select, Table } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const EditRecords = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('lastname');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/students`, {
          headers: {
            Authorization: localStorage.getItem('sessionToken'),
          },
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

  const showDeleteModal = (id) => {
    setSelectedStudentId(id);
    setDeleteModalVisible(true);
  };

  const hideDeleteModal = () => {
    setDeleteModalVisible(false);
    setSelectedStudentId(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/students/${selectedStudentId}`, {
        headers: {
          Authorization: localStorage.getItem('sessionToken'),
        },
      });
      setStudents(students.filter((student) => student._id !== selectedStudentId));
      hideDeleteModal();
    } catch (err) {
      setError(err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (value) => {
    setSortCriteria(value);
    sortStudents(value, students);
  };

  const sortStudents = useCallback((criteria, studentsList) => {
    let sortedStudents;
    if (criteria === 'lastname') {
      sortedStudents = [...studentsList].sort((a, b) =>
        a.last_name.localeCompare(b.last_name)
      );
    } else if (criteria === 'firstname') {
      sortedStudents = [...studentsList].sort((a, b) =>
        a.first_name.localeCompare(b.first_name)
      );
    } else if (criteria === 'grade') {
      sortedStudents = [...studentsList].sort((a, b) => b.grade - a.grade);
    }
    setStudents(sortedStudents);
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      sortStudents(sortCriteria, students);
    }
  }, [students, sortCriteria, sortStudents]);

  const filteredStudents = students.filter(
    (student) =>
      `${student.first_name} ${student.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      `${student.grade}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${student.list_of_trained_tools}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      `${student.user_id}`.includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <Header />
      <div className="edit-records-container">
        <div className="tab-container">
          <Button className="tab selected">Students</Button>
          <Button className="tab">Tools</Button>
        </div>
        <div className="controls-container">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <Select
            value={sortCriteria}
            onChange={handleSortChange}
            className="sort-dropdown"
          >
            <Select.Option value="lastname">Sort By: Last Name A → Z</Select.Option>
            <Select.Option value="firstname">Sort By: First Name A → Z</Select.Option>
            <Select.Option value="grade">Sort By: Grade Level</Select.Option>
          </Select>
          <Button
            type="primary"
            className="add-student-button"
            onClick={handleAddStudent}
          >
            Add a new student
          </Button>
        </div>
        <Table dataSource={filteredStudents} rowKey="_id">
          <Table.Column title="Student ID" dataIndex="user_id" key="user_id" />
          <Table.Column
            title="Student Name"
            dataIndex={["first_name", "last_name"]}
            key="name"
            render={(text, record) => `${record.first_name} ${record.last_name}`}
          />
          <Table.Column title="Grade Level" dataIndex="grade" key="grade" />
          <Table.Column
            title="List of Tools/Experience"
            dataIndex="list_of_trained_tools"
            key="list_of_trained_tools"
            render={(tools) => tools.join(', ')}
          />
          <Table.Column
            title="Update Student"
            key="update"
            render={(text, record) => (
              <Button type="link" onClick={() => handleUpdate(record._id)}>
                Update
              </Button>
            )}
          />
          <Table.Column
            title="Remove Student"
            key="remove"
            render={(text, record) => (
              <Button danger onClick={() => showDeleteModal(record._id)}>
                Delete
              </Button>
            )}
          />
        </Table>

        <Modal
          title="Are you sure you want to delete this student?"
          visible={deleteModalVisible}
          onOk={handleDelete}
          onCancel={hideDeleteModal}
          okText="Yes"
          cancelText="No"
        >
          <ExclamationCircleOutlined />
          <p>This action cannot be undone.</p>
        </Modal>
      </div>
    </div>
  );
};

export default EditRecords;
