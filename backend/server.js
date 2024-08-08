const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoute = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const studentsRoute = require('./routes/students');
const userRouter = require('./routes/user');
const toolsRouter = require('./routes/tools');

const app = express();

// CORS configuration
const allowedOrigins = [
    'https://student-training-system-two.vercel.app', // Add your frontend domain here
    'https://another-allowed-domain.com' // Add other allowed domains if any
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Enable to allow cookies with CORS
}));

app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoute);
app.use('/api/user', userRouter);
app.use('/api/protected', protectedRoutes);
app.use('/api/students', studentsRoute);
app.use('/api/tools', toolsRouter);

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
