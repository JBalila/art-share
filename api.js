require('express');
require('mongodb');

const User = require('./models/User.js');
const Post = require('./models/Post.js');
const Comment = require('./models/Comment.js');

exports.setApp = function(app, client) {
    app.post('/api/login', async(req, res, next) => {
        // Incoming: username, password
        // Outgoing: User-object & JWT token OR error

        let ret;
        const { username, password } = req.body;

        let result = await User.findOne({Username: username, Password: password});

        if (result) {
            try {
                const jwt = require('./createJWT');
                let userObject = Object.assign({}, result)._doc;        // <result> is immutable, so this code bypasses that
                let token = jwt.createToken(JSON.stringify(result));
                ret = Object.assign({}, userObject, token);
            }
            catch(e) {
                ret = {error: e.message};
            }
        }
        else {
            ret = {error: 'Incorrect username/password combination'};
        }

        res.status(200).json(ret);
    });

    app.post('/api/register', async(req, res, next) => {
        // Incoming: firstName, lastName, email, username, password
        // Outgoing: error

        let ret, userExists;
        const { firstName, lastName, email, username, password } = req.body;

        userExists = await User.findOne().or([{Username: username}, {Email: email}]);
        if (userExists) {
            if (userExists.Username === username)
                ret = {error: 'A user with that username already exists'};
            else
                ret = {error: 'A user with that email already exists'};

            res.status(200).json(ret);
            return;
        }

        let newUser = new User({
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Username: username,
            Password: password
        });

        await newUser.save();
        ret = {error: ''};

        res.status(200).json(ret);
    });
}