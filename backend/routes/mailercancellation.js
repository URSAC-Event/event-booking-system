const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ursacevents.management@gmail.com', // Your email
        pass: 'dfww zekg urnn rfxk', // Your Gmail app password (not your regular email password)
    },
});

const sendEventCancellationEmail = (email, eventName, org) => {
    const mailOptions = {
        from: 'ursacevents.management@gmail.com', // Sender's email
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
