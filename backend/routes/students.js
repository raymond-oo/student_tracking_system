const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const students = await User.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students' });
    }
});

module.exports = router;
