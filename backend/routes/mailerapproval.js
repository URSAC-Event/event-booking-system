const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ursacevents.management@gmail.com', // Your email
        pass: 'dfww zekg urnn rfxk', // Your Gmail app password (not your regular email password)
    },
});

const sendEventApprovalEmail = (email, eventName, organization) => {
    const mailOptions = {
        from: 'ursacevents.management@gmail.com', // Sender's email
        to: email,
        subject: 'Event Approval Notification',
        text: `Dear ${organization},\n\nYour event "${eventName}" has been approved and is now live in the system.\n\nBest regards,\nEvent Management Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending event approval email:', error);
        } else {
            console.log('Event approval email sent:', info.response);
        }
    });
};

module.exports = { sendEventApprovalEmail };
