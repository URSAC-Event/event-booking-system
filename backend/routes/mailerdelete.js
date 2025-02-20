const nodemailer = require('nodemailer');


// Create a transport object using Gmail service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'testemailmailtest45@gmail.com', // Your email
    pass: 'panjiaetywoabppp', // Your Gmail app password (not your regular email password)
  },
});

// Function to send an event deletion email
const sendEventDeletionEmail = (email, eventName, organization) => {
  const mailOptions = {
    from: 'testemailmailtest45@gmail.com', // Sender's email
    to: email, // Recipient's email
    subject: 'Event Deletion Notification',
    text: `Dear ${organization},\n\nThe event "${eventName}" has been deleted from the system. If this was not intentional or you have any questions, please contact us.\n\nBest regards,\nEvent Management Team`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending event deletion email:', error);
    } else {
      console.log('Event deletion email sent:', info.response);
    }
  });
};
module.exports = { sendEventDeletionEmail }; // Export the function
