const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configure multer storage options
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Save the file with a unique name (e.g., timestamp + original name)
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Route to handle file upload
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    // Construct the file URL
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

module.exports = router;
