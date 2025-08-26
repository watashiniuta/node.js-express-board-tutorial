const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendAuthCode(req, email, subject, purpose) {
    // create random number
    const ranNum = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;

    // emailAuthCode object initializing
    if (req.session.emailAuthCode === undefined) {
        req.session.emailAuthCode = {};
    }
    const emailAuthCode = req.session.emailAuthCode[purpose] = ranNum.toString();

    const transporter = nodemailer.createTransport({
        host: "smtp.naver.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.hostEmail,
            pass: process.env.hostPassword
        }
    });

    await transporter.sendMail({
        from: `"My Website" <${process.env.hostEmail}>`,
        to: email,
        subject: subject,
        text: emailAuthCode
    });
}

function verifyAuthCode(req, inputCode, purpose) {
    const match = req.session.emailAuthCode[purpose] === inputCode;
    if (match) delete req.session.emailAuthCode[purpose];
    return match;
}

module.exports = { sendAuthCode, verifyAuthCode };