// routes/students.js
const express = require('express');
const User = require('../models/User');
const verifySession = require('../middleware/verifySession');

const router = express.Router();

router.get('/', verifySession, async (req, res) => {
    try {
        const students = await User.find().select('-google_id -session');
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students', error });
    }
});

module.exports = router;
