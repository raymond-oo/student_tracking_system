const express = require('express');
const router = express.Router();
const verifySession = require('../middleware/verifysession');

router.get('/me', verifySession, (req, res) => {
    res.send(req.user);
});

module.exports = router;
