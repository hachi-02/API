const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'dungntps40706@gmail.com',
        pass: 'psue hfpl cysx zqbs'
    }
});


module.exports = { transporter };