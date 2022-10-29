const jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer');
const nodemailerSendGrid = require('nodemailer-sendgrid');
const transport = nodemailer.createTransport(
    nodemailerSendGrid({apiKey: process.env.SENDGRID_API_KEY})
);

exports.sendConfirmationEmail = async function (user) {
    let userID = {id: user._id.toString()};
    let emailToken = await jwt.sign(userID, process.env.ACCESS_TOKEN_SECRET);
    let url = 'http://localhost:5000' + `/confirmation/${emailToken}`;

    transport.sendMail({
        from: 'artsharegrp11@gmail.com',
        to: `${user.FirstName} ${user.LastName} <${user.Email}>`,
        subject: 'Account Confirmation for Art-Share',
        html: `Click this link to verify your Art-Share account <a href=${url}>${url}</a>.We hope to see you there!`
    });
}