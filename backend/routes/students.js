const express = require("express");
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const User = require("../models/User");
const verifySession = require("../middleware/verifysession");

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid duplicate filenames
    }
});

const upload = multer({ storage: storage });

// Get all students
router.get("/", verifySession, async (req, res) => {
    try {
        const students = await User.find({ is_admin: false });
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single student
router.get("/:id", verifySession, async (req, res) => {
    try {
        const student = await User.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new student
router.post("/", verifySession, upload.single('profile_picture'), async (req, res) => {
    let studentData = req.body;
    if (!studentData.user_id) {
        studentData.user_id = User.generateUniqueId();
    }

    const profile_picture = req.file ? req.file.path : null;

    const student = new User({
        ...studentData,
        profile_picture,
        is_admin: false,
    });

    try {
        const newStudent = await student.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a student
router.put("/:id", verifySession, upload.single('profile_picture'), async (req, res) => {
    const updates = { ...req.body };
    if (req.file) {
        updates.profile_picture = req.file.path;
    }

    try {
        const updatedStudent = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a student
router.delete("/:id", verifySession, async (req, res) => {
    try {
        const student = await User.findByIdAndDelete(req.params.id);
        if (student && student.profile_picture) {
            fs.unlink(student.profile_picture, (err) => {
                if (err) console.error("Failed to delete profile picture:", err);
            });
        }
        res.json({ message: "Student deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
