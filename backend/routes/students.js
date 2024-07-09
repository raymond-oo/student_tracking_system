// routes/students.js
const express = require('express');
const verifySession = require('../middleware/verifySession');
const User = require('../models/User');

const router = express.Router();

// Get all students
router.get('/', verifySession, async (req, res) => {
    try {
        const students = await User.find();
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
