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
            return false;
        } else {
            console.log('Email sent successfully');
            return true;
        }
    })
    
}

module.exports = emailNewUser;