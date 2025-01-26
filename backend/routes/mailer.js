const nodemailer = require('nodemailer');

// Create a transport object using Gmail service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'testemailmailtest45@gmail.com', // Your email
    pass: 'panjiaetywoabppp', // Your Gmail app password (not your regular email password)
  },
});

// Function to send a verification code email
const sendVerificationCode = (email, code) => {
  const mailOptions = {
    from: 'testemailmailtest45@gmail.com', // Sender's email
    to: email, // Recipient's email
    subject: 'Your Verification Code',
    text: `Your 6-digit verification code is: ${code}`,
  };

  // Send the email using Nodemailer
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};




// Temporary test function
const testEmail = () => {
  const testEmail = 'victordelossantos179@gmail.com'; // Test email address
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code

  console.log(`Sending verification code "${verificationCode}" to ${testEmail}...`);
  sendVerificationCode(testEmail, verificationCode);
};

// Run the test function when this file is executed directly
if (require.main === module) {
  testEmail();
}

module.exports = { sendVerificationCode };
