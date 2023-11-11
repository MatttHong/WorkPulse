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
        return true
    } else {
        return new Promise((resolve, reject) => {
            mailTransporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                    console.error(err);
                    console.log('Error Occurs');
                    resolve(false);
                } else {
                    console.log('Email sent successfully');
                    console.log(data);
                    resolve(true);
                }
            });
        });
    }
}

module.exports = emailNewUser;