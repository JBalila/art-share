const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.createToken = function(userObject) {
    return _createToken(userObject);
}

_createToken = function(userObject) {
    let ret;

    try {
        let accessToken = jwt.sign(userObject, process.env.ACCESS_TOKEN_SECRET);
        ret = {accessToken: accessToken};
    }
    catch(e) {
        ret = {error: e.message}
    }

    return ret;
}

exports.isExpired = function(token) {
    let isExpired = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, verifiedJWT) => {
        if (err)
            return true;
        else
            return false;
    });

    return isExpired;
}

exports.refresh = function(token) {
    let userObject = jwt.decode(token, {complete: true}).payload;

    return _createToken(userObject);
}

exports.createEmailToken = function(username) {
    let ret;

    try {
        let emailToken = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'});
        ret = {emailToken: emailToken}
    }
    catch(e) {
        ret = {error: e.message};
    }

    return ret;
}