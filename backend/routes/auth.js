const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const router = express.Router();
const client = new OAuth2Client('945899431720-vulljqk5528th1uora746n3g2s999uk2.apps.googleusercontent.com');

let userIdCounter = 0; // Ideally, this should be stored in the database and fetched upon server start

const calculateGrade = (email) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0-based month (0 is January, 11 is December)
    const graduationYear = parseInt(email.slice(0, 2)) + 2000; // Assuming emails are like 25oor@isyedu.org

    let grade;
    if (currentMonth < 6) {
        // January to June
        grade = graduationYear - currentYear + 11;
    } else {
        // July to December
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
            userIdCounter += 1;
            user = new User({
                user_id: userIdCounter,
                google_id: sub,
                first_name: given_name,
                last_name: family_name,
                email: email,
                profile_image: picture,
                grade: grade,
            });
            await user.save();
        } else {
            // Update the grade if user already exists
            user.grade = grade;
            await user.save();
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(400).send('Error verifying token');
    }
});

module.exports = router;
