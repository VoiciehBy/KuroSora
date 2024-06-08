const dotenv = require("dotenv");
const config = require("./config").mail;
const nodemailer = require("nodemailer");

dotenv.config();

const transporter = nodemailer.createTransport({
    host: config.hostname,
    port: config.port,
    secure: false,
    auth: {
        user: config.test_email,
        pass: process.env.TEST_MAIL_PASSWORD
    },
    tls: { rejectUnauthorized: false }
})

async function sendMail(email = "", subject = "", text = "", html = "<h1>XD</h1>") {
    await transporter.sendMail({
        from: '"KuroSora Team" <noreply@kurosora.edu>',
        to: `${email}`,
        subject: `${subject}`,
        text: `${text}`,
        html: `${html}`
    });
    console.log("The E-mail message sent...");
}

async function sendActivationMail(email = "", code = "12345", username = "") {
    sendMail(email, "Activate your KuroSora Account", `Dear ${username} your activation code is ${code}`, `<h1>Dear ${username} your activation code is ${code}</h1>`)
}

async function sendVerifcationMail(email = "", code = "12345", username = "") {
    sendMail(email, "Verificate your KuroSora Account", `Dear ${username} your verification code is ${code}`, `<h1>Dear ${username} your verification code is ${code}</h1>`)
}

async function sendRecoveryMail(email = "", code = "12345", username = "") {
    sendMail(email, "Recovery code for your KuroSora Account", `Dear ${username} your recovery code is ${code}`, `<h1>Dear ${username} your recovery code is ${code}</h1>`)
}

module.exports = {
    sendAuthMail: (c, u) => sendActivationMail(config.test_email, c, u),
    sendAuth_1Mail: (c, u) => sendVerifcationMail(config.test_email, c, u),
    sendAuth_2Mail: (c, u) => sendRecoveryMail(config.test_email, c, u),
}