// routes/route.js
const express = require('express');
const bcrypt = require('bcrypt');
const { sendVerificationCode } = require('./mailer');
const router = express.Router();
const connection = require('../connection/db');  // import the database connection





//sent email code 
router.post('/api/send-verification-code', (req, res) => {
  const { email } = req.body;
  console.log('Received request to send verification code for email:', email); // Debug log

  if (!email) {
    console.log('No email provided.');
    return res.status(400).send({ message: 'Email is required' });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString(); // Generate code
  console.log('Generated code:', code); // Debug log

  sendVerificationCode(email, code); // Send the email
  res.status(200).send({ message: 'Verification code sent', verificationCode: code });
});




// Get all councils
router.get('/councils', (req, res) => {
  const query = 'SELECT * FROM councils';
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching councils' });
    }
    res.status(200).json(results);
  });
});





















module.exports = router;
