const nodemailer = require('nodemailer');
const mailTransporter = require('../secret/secret');

function emailNewUser(emailAddress, subject, body) {

    let mailDetails = {
        from: 'pulseemailservice@gmail.com',
        to: emailAddress,
        subject: subject,
        text: body
    };

    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    })
}

module.exports = emailNewUser;