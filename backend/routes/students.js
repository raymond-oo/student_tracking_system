const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Tool = require('../models/Tool');
const verifySession = require('../middleware/verifysession');

// Get all students
router.get('/', verifySession, async (req, res) => {
    try {
        const students = await User.find({ is_admin: false }).populate('list_of_trained_tools');
        console.log('Fetched students:', students);
        res.json(students);
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get a single student
router.get('/:id', verifySession, async (req, res) => {
    try {
        const student = await User.findById(req.params.id).populate('list_of_trained_tools');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        console.log('Fetched student:', student);
        res.json(student);
    } catch (err) {
        console.error('Error fetching student:', err);
        res.status(500).json({ message: err.message });
    }
});

// Add a new student
router.post('/', verifySession, async (req, res) => {
    let studentData = req.body;
    if (!studentData.user_id) {
        studentData.user_id = User.generateUniqueId();
    }

    const student = new User({
        ...studentData,
        is_admin: false
    });

    try {
        const newStudent = await student.save();
        const populatedStudent = await newStudent.populate('list_of_trained_tools').execPopulate();
        console.log('Created new student:', populatedStudent);
        res.status(201).json(populatedStudent);
    } catch (err) {
        console.error('Error creating student:', err);
        res.status(400).json({ message: err.message });
    }
});

// Update a student
router.put('/:id', verifySession, async (req, res) => {
    try {
        const updatedStudent = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('list_of_trained_tools');
        console.log('Updated student:', updatedStudent);
        res.json(updatedStudent);
    } catch (err) {
        console.error('Error updating student:', err);
        res.status(400).json({ message: err.message });
    }
});

// Delete a student
router.delete('/:id', verifySession, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        console.log('Deleted student:', req.params.id);
        res.json({ message: 'Student deleted' });
    } catch (err) {
        console.error('Error deleting student:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;