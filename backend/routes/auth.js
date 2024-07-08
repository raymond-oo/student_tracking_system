// routes/auth.js
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const router = express.Router();
const client = new OAuth2Client('945899431720-vulljqk5528th1uora746n3g2s999uk2.apps.googleusercontent.com');

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
      audience: '945899431720-vulljqk5528th1uora746n3g2s999uk2.apps.googleusercontent.com',
    });

    const payload = ticket.getPayload();
    const { sub, given_name, family_name, email, picture } = payload;

    if (!email.endsWith('@isyedu.org')) {
      return res.status(403).send('Unauthorized domain');
    }

    const grade = calculateGrade(email);

    let user = await User.findOne({ email });

    if (!user) {
      const userId = await User.getNextUserId();

      user = new User({
        user_id: userId,
        google_id: sub,
        first_name: given_name,
        last_name: family_name,
        email: email,
        profile_image: picture,
        grade: grade,
      });
      await user.save();
    } else {
      user.grade = grade;
      user.profile_image = picture;
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(400).send('Error verifying token');
  }
});

module.exports = router;
