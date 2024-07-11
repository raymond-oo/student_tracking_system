// routes/auth.js
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid'); // Use UUID for generating session tokens

const router = express.Router();
const client = new OAuth2Client('503971750045-jke96ruuail5lvds58hc8vfccado58n5.apps.googleusercontent.com');

const calculateGrade = (email) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const graduationYear = parseInt(email.slice(0, 2)) + 2000;

  let grade;
  if (currentMonth < 7) {
    grade = graduationYear - currentYear + 11;
  } else {
    grade = graduationYear - currentYear + 12;
  }

  return grade;
};

router.post('/google', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '503971750045-jke96ruuail5lvds58hc8vfccado58n5.apps.googleusercontent.com',
    });

    const payload = ticket.getPayload();
    const { sub, given_name, family_name, email, picture } = payload;

    if (!email.endsWith('@isyedu.org')) {
      return res.status(403).send('Unauthorized domain');
    }

    const grade = calculateGrade(email);

    let user = await User.findOne({ email });

    if (!user) {
      const userId = User.generateUniqueId();
      const sessionToken = uuidv4(); // Generate a session token

      user = new User({
        user_id: userId,
        google_id: sub,
        first_name: given_name,
        last_name: family_name,
        email: email,
        profile_image: picture,
        grade: grade,
        session: sessionToken, // Store session token
      });
      await user.save();
    } else {
      user.grade = grade;
      user.profile_image = picture;
      user.session = uuidv4(); // Update session token
      await user.save();
    }

    res.status(200).json({ user, sessionToken: user.session }); // Return session token to client
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(400).send('Error verifying token');
  }
});

module.exports = router;
