const nodemailer = require('nodemailer')
const xoauth2 = require('xoauth2')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: process.env.userEmail,
        pass: process.env.password,
        clientId: process.env.clientId,
        clientSecret: process.env.clientSecret,
        refreshToken: process.env.refreshToken,
    },
})

module.exports = transporter
