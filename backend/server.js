// server.js (or index.js, main server file)
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/students');
const protectedRoutes = require('./routes/protected');
const studentRoutes = require('./routes/students');

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/student_tracking_system')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/protected', protectedRoutes);
app.use('/api/students', studentRoutes);  // Add this line

const PORT = process.env.PORT || 5001; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
