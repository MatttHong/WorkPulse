// vukoommqkyisrmmx
const nodemailer = require('nodemailer');

let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pulseemailservice@gmail.com',
        pass: 'vukoommqkyisrmmx'
    }
});

let JWT_SECRET = "Ydwgiq3Lpz19OUNaKTFipkypE4WmVC82"

module.exports = {
    JWT_SECRET,
    mailTransporter
};