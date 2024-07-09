const User = require('../models/User');

const verifySession = async (req, res, next) => {
  const sessionToken = req.header('Authorization');

  if (!sessionToken) {
    return res.status(401).send('Access denied. No session token provided.');
  }

  const user = await User.findOne({ session: sessionToken });

  if (!user) {
    return res.status(401).send('Invalid session token.');
  }

  req.user = user; // Attach user to request object
  next();
};

module.exports = verifySession;
