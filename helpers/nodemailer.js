const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'josuelubaki30@gmail.com',
        pass: 'Heroesdemarvel',
    },
})

module.exports = transporter
