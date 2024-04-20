const dotenv = require("dotenv")
const nodemailer = require("nodemailer");

dotenv.config()

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: "laurel57@ethereal.email",
        pass: process.env.TEST_MAIL_PASSWORD
    },
    tls: { rejectUnauthorized: false }
})

async function sendMail(email, subject = "", text = "", html = "<h1>XD</h1>") {
    await transporter.sendMail({
        from: '"KuroSora Team" <noreply@kurosora.edu>',
        to: `${email}`,
        subject: `${subject}`,
        text: `${text}`,
        html: `${html}`
    });
    console.log("The E-mail message sent...");
}

async function sendActivationMail(email, code = "12345") {
    sendMail(email, "Activate your KuroSora Account", `Activation code:${code}`, `<h1>${code}</h1>`)
}

async function sendVerifcationMail(email, code = "12345") {
    sendMail(email, "Verificate your KuroSora Account", `Verification code:${code}`, `<h1>${code}</h1>`)
}

async function sendRecoveryMail(email, code = "12345"){
    sendMail(email, "Recovery code for your KuroSora Account", `Recovery code:${code}`, `<h1>${code}</h1>`)
}

module.exports = {
    sendAuthMail: (e, c) => sendActivationMail(e, c),
    sendAuth_1Mail: (e, c) => sendVerifcationMail(e, c),
    sendAuth_2Mail: (e, c) => sendRecoveryMail(e, c),
}