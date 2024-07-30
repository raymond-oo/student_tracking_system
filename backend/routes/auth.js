// routes/auth.js
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid'); // Use UUID for generating session tokens

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const calculateGrade = (email) => {
    // Get current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-11, where 0 is January

    // Extract first two digits from email
    const gradDigits = email.slice(0, 2);
    
    // Convert to full graduation year
    const gradYear = 2000 + parseInt(gradDigits);
    
    // Determine the academic year
    // If it's July or later, we consider it the next academic year
    const academicYear = currentMonth >= 6 ? currentYear + 1 : currentYear;
    
    // Calculate years until graduation
    const yearsUntilGrad = gradYear - academicYear;
    
    // Calculate current grade
    const grade = 12 - yearsUntilGrad;
    
    return grade;
};

router.post('/google', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, given_name, family_name, email, picture } = payload;

    // ONLY NEEDED IF OAUTH'S PERMISSIONS ARE SET TO PUBLIC

    if (!email.endsWith('@isyedu.org')) {
      return res.status(403).send('Unauthorized domain');
    }  

    const grade = calculateGrade(email);

    if(!picture) {
      picture = "https://static.vecteezy.com/system/resources/previews/020/911/747/non_2x/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png";
    }

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
