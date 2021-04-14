const nodemailer = require('nodemailer')
const { USER, PASS } = require('./mailgun-credentials')
// const config = require('./mailgun-credentials')
// const mailgun = require("mailgun-js");
// const DOMAIN = 'YOUR_DOMAIN_NAME';
// const mg = mailgun({apiKey: api_key, domain: DOMAIN});
const transport = nodemailer.createTransport({
// const transport = nodemailer.createTransport("smtps://admin@n-dots.com:xw#XvUZ3@webmail.n-dots.com/?pool=true")
    pool:true,
    // host: "smtp.n-dots.com",
    host: "smtp.gmail.com",
    // secureConnection: true,
    port: 587,
    // secure: false,
    auth: {
        user: USER,
        pass: PASS
     },
    tls: {
        secureProtocol: "TLSv1_method",
        rejectUnauthorized: false
    }
})

module.exports = {
    async sendEmail(from, subject, to, html){
        return new Promise((resolve, reject) => {
            transport.sendMail({ from, subject, to, html }, (err, info) => {
                if(err) reject(err);
                resolve(info)
            })
        })
    }
}