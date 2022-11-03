const jwt = require('jsonwebtoken');
const bp = require('./frontend/src/components/Path');

const nodemailer = require('nodemailer');
const nodemailerSendGrid = require('nodemailer-sendgrid');
const transport = nodemailer.createTransport(
    nodemailerSendGrid({apiKey: process.env.SENDGRID_API_KEY})
);

exports.sendConfirmationEmail = async function(user) {
    let userID = {id: user._id.toString()};
    let emailToken = await jwt.sign(userID, process.env.ACCESS_TOKEN_SECRET);
    let url = bp.buildPath(`/confirmation/${emailToken}`);

    transport.sendMail({
        from: 'artsharegrp11@gmail.com',
        to: `${user.Username} <${user.Email}>`,
        subject: 'Account Confirmation for Art-Share',
        html: `Click this link to verify your Art-Share account <a href=${url}>${url}</a>.We hope to see you there!`
    });
}

exports.sendResetPasswordEmail = async function(user) {
    let userID = user._id.toString();
    let url;

    if (process.env.NODE_ENV === 'production')
        url = `https://art-share-grp11.herokuapp.com/resetPassword/?id=${userID}`;
    else
        url = `http://localhost:3000/resetpassword/?id=${userID}`;

    transport.sendMail({
        from: 'artsharegrp11@gmail.com',
        to: `${user.Username} <${user.Email}>`,
        subject: 'Reset Password Link',
        html: `Click this link to reset your Art-Share password: <a href=${url}>${url}</a>`
    });
}