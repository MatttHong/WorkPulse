const nodemailer = require('nodemailer');
const { mailTransporter } = require('../secret/secret');

function emailNewUser(emailAddress, subject, body) {

    let mailDetails = {
        from: 'pulseemailservice@gmail.com',
        to: emailAddress,
        subject: subject,
        text: body
    };
    if(process.env.NODE_ENV === 'test'){
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(true), 100); // Using setTimeout instead of sleep
        });
    } else {
        return new Promise((resolve, reject) => {
            mailTransporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                    console.error(err);
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }
}

module.exports = emailNewUser;