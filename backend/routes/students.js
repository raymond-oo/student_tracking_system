const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifySession = require("../middleware/verifysession");

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
router.post("/", verifySession, async (req, res) => {
  let studentData = req.body;
  if (!studentData.user_id) {
    studentData.user_id = User.generateUniqueId();
  }

  const student = new User({
    ...studentData,
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
router.put("/:id", verifySession, async (req, res) => {
  try {
    const updatedStudent = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a student
router.delete("/:id", verifySession, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
