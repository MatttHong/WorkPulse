// vukoommqkyisrmmx
const nodemailer = require('nodemailer');

let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pulseemailservice@gmail.com',
        pass: 'vukoommqkyisrmmx'
    }
});

module.exports = mailTransporter;