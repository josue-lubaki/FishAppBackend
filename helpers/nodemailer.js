const nodemailer = require('nodemailer')
// const hbs = require('nodemailer-express-handlebars')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'josuelubaki30@gmail.com',
        pass: 'Heroesdemarvel',
    },
})

// transporter.use(
//     'compile',
//     hbs({
//         viewEngine: 'express-handlebars',
//         viewPath: './helpers/views/',
//     })
// )

// const options = {
//     from: 'josuelubaki30@gmail.com',
//     to: 'josuelubaki@gmail.com',
//     subject: 'Sending email with node.js',
//     text: `it's working {{username}}`,
//     // template: 'index',
// }

// transporter.sendMail(options, function (err, res) {
//     if (err) {
//         console.error(err)
//         return
//     }

//     console.log('sent : ' + res.response)
// })

module.exports = transporter
