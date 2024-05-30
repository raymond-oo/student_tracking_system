const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const router = express.Router();
const client = new OAuth2Client('945899431720-vulljqk5528th1uora746n3g2s999uk2.apps.googleusercontent.com');

let userIdCounter = 0; // Ideally, this should be stored in the database and fetched upon server start

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
            });
            await user.save();
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(400).send('Error verifying token');
    }
});

module.exports = router;
