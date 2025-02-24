const dotenv = require("dotenv");
const config = require("./config").mail;
const test_config = require("./config").test_mail;
const nodemailer = require("nodemailer");
const devMode = require("./config").devMode;

dotenv.config();

const transporter = nodemailer.createTransport({
    host: config.noreply.hostname,
    port: config.noreply.port,
    secure: config.noreply.secure,
    auth: {
        user: config.noreply.address,
        pass: process.env.NOREPLY_MAIL_PASSWORD
    },
    tls: { rejectUnauthorized: false }
});

const test_transporter = nodemailer.createTransport({
    host: test_config.noreply.hostname,
    port: test_config.noreply.port,
    secure: test_config.noreply.secure,
    auth: {
        user: test_config.noreply.address,
        pass: process.env.NOREPLY_TEST_MAIL_PASSWORD
    },
    tls: { rejectUnauthorized: false }
});

async function sendMail(email = "", subject = "", text = "", html = "<h1>XD</h1>") {
    if (devMode.server)
        await transporter.sendMail({
            from: '"KuroSora Team" <noreply@kurosora.edu>',
            to: `${email}`,
            subject: `${subject}`,
            text: `${text}`,
            html: `${html}`
        });
    else
        await test_transporter.sendMail({
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
    sendAuthMail: (e, c, u) => sendActivationMail(e, c, u),
    sendAuth_1Mail: (e, c, u) => sendVerifcationMail(e, c, u),
    sendAuth_2Mail: (e, c, u) => sendRecoveryMail(e, c, u)
}