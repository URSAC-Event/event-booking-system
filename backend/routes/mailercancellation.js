const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'testemailmailtest45@gmail.com', // Your email
        pass: 'panjiaetywoabppp', // Your Gmail app password
    },
});

const sendEventCancellationEmail = (email, eventName, org) => {
    const mailOptions = {
        from: 'testemailmailtest45@gmail.com',
        to: email,
        subject: 'Event Cancellation Notification',
        text: `Dear ${org},\n\nThe event "${eventName}" has been canceled. If you have any questions, please contact us.\n\nBest regards,\nEvent Management Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending event cancellation email:', error);
        } else {
            console.log('Event cancellation email sent:', info.response);
        }
    });
};

module.exports = { sendEventCancellationEmail };
