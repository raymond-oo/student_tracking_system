const User = require('../models/User');

const verifySession = async (req, res, next) => {
    const sessionToken = req.headers.authorization;

    if (!sessionToken) {
        return res.status(401).json({ message: 'No session token provided' });
    }

    try {
        const user = await User.findOne({ session: sessionToken });
        if (!user) {
            return res.status(401).json({ message: 'Invalid session token' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error verifying session token' });
    }
};

module.exports = verifySession;