const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const calculateGrade = (email) => {
    // Your existing calculateGrade logic
};

router.post('/google', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, given_name, family_name, email } = payload;

    if (!email.endsWith('@isyedu.org')) {
      return res.status(403).send('Unauthorized domain');
    }

    const grade = calculateGrade(email);

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });

    const people = google.people({ version: 'v1', auth: oauth2Client });
    const me = await people.people.get({
      resourceName: 'people/me',
      personFields: 'photos',
    });

    const photos = me.data.photos || [];
    const profile_image = photos.length > 0
      ? photos[0].url
      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

    let user = await User.findOne({ email });

    if (!user) {
      const userId = User.generateUniqueId();
      const sessionToken = uuidv4();

      user = new User({
        user_id: userId,
        google_id: sub,
        first_name: given_name,
        last_name: family_name,
        email: email,
        profile_image: profile_image,
        grade: grade,
        session: sessionToken,
      });
      await user.save();
    } else {
      user.grade = grade;
      user.profile_image = profile_image;
      user.session = uuidv4();
      await user.save();
    }

    res.status(200).json({ user, sessionToken: user.session });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(400).send('Error verifying token');
  }
});

module.exports = router;
