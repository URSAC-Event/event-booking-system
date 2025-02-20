const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'testemailmailtest45@gmail.com',
        pass: 'panjiaetywoabppp',
    },
});

const sendEventApprovalEmail = (email, eventName, organization) => {
    const mailOptions = {
        from: 'testemailmailtest45@gmail.com',
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
