const express = require('express');
const verifySession = require('../middleware/verifySession');

const router = express.Router();

router.get('/protected', verifySession, (req, res) => {
  res.status(200).send(`Hello, ${req.user.first_name}! You have access to this content.`);
});

module.exports = router;
