require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoute = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const studentsRoute = require('./routes/students');
const userRouter = require('./routes/user');
const toolsRouter = require('./routes/tools');
const uploadRouter = require('./routes/upload');

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));


app.use('/api/auth', authRoute);
app.use('/api/user', userRouter);
app.use('/api/protected', protectedRoutes);
app.use('/api/students', studentsRoute);
app.use('/api/tools', toolsRouter);
app.use('/api/upload', uploadRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
