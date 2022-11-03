require('express');
require('mongodb');
const { json } = require('body-parser');

const jwt = require('../createJWT');
const User = require('../models/User');
const errorHandling = require('./errorHandling/userErrorHandling');
const emailService = require('../emailService');

exports.setUserEndpoints = function(app, client) {
    app.post('/api/login', async(req, res, next) => {
        // Incoming: username, password
        // Outgoing: User-object with JWT OR error

        let ret;
        const { username, password } = req.body;

        let result = await User.findOne()
            .or([{Username: username, Password: password}, {Email: username, Password: password}])
            .select('-Password -__v');

        if (result) {
            if (!result.IsVerified) {
                ret = {error: 'Please verify your account before logging in'};
            }
            else {
                try {
                    let userObject = Object.assign({}, result)._doc;        // <result> is immutable, so this code bypasses that
                    let token = jwt.createToken(userObject);
                    ret = Object.assign({user: userObject}, token);
                }
                catch(e) {
                    ret = {error: e.message};
                }
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

        emailService.sendConfirmationEmail(newUser);
        await newUser.save();
        ret = {error: ''};

        res.status(200).json(ret);
    });

    app.get('/confirmation/:token', async(req, res) => {
        try {
            let userID = jwt.verifyConfirmationEmail(req.params.token);
            let user = await User.findOne({_id: userID});
            user.IsVerified = true;
            user.save();
        }
        catch(e) {
            res.send(e);
        }

        if (process.env.NODE_ENV === 'production')
            res.redirect('https://art-share-grp11.herokuapp.com');
        else
            res.redirect('http://localhost:3000'); 
    });

    app.post('/api/getUsername', async(req, res, next) => {
        // Incoming: userID (_id of user to retrieve)
        // Outgoing: username (Username of userID) OR error

        let ret;
        const { userID } = req.body;

        let user = await User.findOne({_id: userID});
        if (user)
            ret = user.Username;
        else
            ret = {error: 'A user with that ID does not exist'};

        res.status(200).json(ret);
    });

    app.post('/api/sendFriendRequest', async(req, res, next) => {
        // Incoming: username (Username of logged-in user), friendUsername (Username of friend to add), and accessToken
        // Outgoing: _id of friend + accessToken OR error

        let ret;
        const { username, friendUsername, accessToken } = req.body;

        // Check if <accessToken> is expired
        try {
            if (jwt.isExpired(accessToken)) {
                ret = {error: 'The JWT is no longer valid'};
                res.status(200).json(ret);
                return;
            }
        }
        catch(e) {
            console.log(e.message);
        }

        // Track <user>'s request to <friend> to prevent duplicate sendings
        try {
            let user = await User.findOne({Username: username});
            let friend = await User.findOne({Username: friendUsername});

            errorHandling.handleErrors('/api/sendFriendRequest', user, friend);

            // Update <user> and <friend> documents after checking for all errors
            user.SentRequests.push(friend._id);
            await user.save();
            friend.PendingRequests.push(user._id);
            await friend.save();

            ret = {id: friend._id};
        }
        catch(e) {
            ret = {error: e.message};
            res.status(200).json(ret);
            return;
        }

        // Send back newly refreshed <accessToken>
        let refreshedToken;
        try {
            refreshedToken = jwt.refresh(accessToken);
        }
        catch(e) {
            console.log(e.message);
        }

        ret = Object.assign(ret, refreshedToken);
        res.status(200).json(ret);
    });

    app.post('/api/acceptFriendRequest', async(req, res, next) => {
        // Incoming: username (Username of logged-in user), friendUsername (Username of friend to add), and accessToken
        // Outgoing: _id of friend + accessToken OR error

        let ret;
        const { username, friendUsername, accessToken } = req.body;

        // Check if <accessToken> is expired
        try {
            if (jwt.isExpired(accessToken)) {
                ret = {error: 'The JWT is no longer valid'};
                res.status(200).json(ret);
                return;
            }
        }
        catch(e) {
            console.log(e.message);
        }

        try {
            let user = await User.findOne({Username: username});
            let friend = await User.findOne({Username: friendUsername});

            errorHandling.handleErrors('/api/acceptFriendRequest', user, friend);
            
            // Remove <friendID> from Sent/PendingRequests and add to <user>'s Clique
            let indexInPending = user.PendingRequests.indexOf(friend._id);
            let indexInSent = user.SentRequests.indexOf(friend._id);
            if (indexInPending !== -1)
                user.PendingRequests.splice(indexInPending, 1);
            if (indexInSent !== -1)
                user.SentRequests.splice(indexInSent, 1);
            user.Clique.push(friend._id);
            await user.save();

            // Remove <userID> from Sent/PendingRequests and add to <friend>'s Clique
            indexInSent = friend.SentRequests.indexOf(user._id);
            indexInPending = friend.PendingRequests.indexOf(user._id);
            if (indexInSent !== -1)
                friend.SentRequests.splice(indexInSent, 1);
            if (indexInPending !== -1)
                friend.PendingRequests.splice(indexInPending, 1);
            friend.Clique.push(user._id);
            await friend.save();

            ret = {id: friend._id};
        } 
        catch(e) {
            ret = {error: e.message};
            res.status(200).json(ret);
            return;
        }

        // Send back newly refreshed <accessToken>
        let refreshedToken;
        try {
            refreshedToken = jwt.refresh(accessToken);
        }
        catch(e) {
            console.log(e.message);
        }

        ret = Object.assign(ret, refreshedToken);
        res.status(200).json(ret);
    });

    app.post('/api/declineFriendRequest', async(req, res, next) => {
        // Incoming: username (Username of logged-in user), friendUsername (Username of friend to add), and accessToken
        // Outgoing: _id of friend + accessToken OR error

        let ret;
        const { username, friendUsername, accessToken } = req.body;

        // Check if <accessToken> is expired
        try {
            if (jwt.isExpired(accessToken)) {
                ret = {error: 'The JWT is no longer valid'};
                res.status(200).json(ret);
                return;
            }
        }
        catch(e) {
            console.log(e.message);
        }

        try {
            let user = await User.findOne({Username: username});
            let friend = await User.findOne({Username: friendUsername});

            errorHandling.handleErrors('/api/declineFriendRequest', user, friend);

            // Remove <friend> from Sent/PendingRequests without adding to <user>'s Clique
            let indexInPending = user.PendingRequests.indexOf(friend._id);
            let indexInSent = user.SentRequests.indexOf(friend._id);
            if (indexInPending !== -1)
                user.PendingRequests.splice(indexInPending, 1);
            if (indexInSent !== -1)
                user.SentRequests.splice(indexInSent, 1);
            await user.save();

            // Remove <userID> from Sent/PendingRequests without adding to <friend>'s Clique
            indexInSent = friend.SentRequests.indexOf(user._id);
            indexInPending = friend.PendingRequests.indexOf(user._id);
            if (indexInSent !== -1)
                friend.SentRequests.splice(indexInSent, 1);
            if (indexInPending !== -1)
                friend.PendingRequests.splice(indexInPending, 1);
            await friend.save();

            ret = {id: friend._id};
        }
        catch(e) {
            ret = {error: e.message};
            res.status(200).json(ret);
            return;
        }

        // Send back newly refreshed <accessToken>
        let refreshedToken;
        try {
            refreshedToken = jwt.refresh(accessToken);
        }
        catch(e) {
            console.log(e.message);
        }

        ret = Object.assign(ret, refreshedToken);
        res.status(200).json(ret);
    });

    app.post('/api/removeFriend', async(req, res, next) => {
        // Incoming: username (Username of logged-in user), friendUsername (Username of friend to add), and accessToken
        // Outgoing: _id of friend + accessToken OR error

        let ret;
        const { username, friendUsername, accessToken } = req.body;

        // Check if <accessToken> is expired
        try {
            if (jwt.isExpired(accessToken)) {
                ret = {error: 'The JWT is no longer valid'};
                res.status(200).json(ret);
                return;
            }
        }
        catch(e) {
            console.log(e.message);
        }

        try {
            let user = await User.findOne({Username: username});
            let friend = await User.findOne({Username: friendUsername});

            errorHandling.handleErrors('/api/removeFriend', user, friend);

            // Remove <user> and <friend> from each others' Cliques
            let indexInClique = user.Clique.indexOf(friend._id);
            user.Clique.splice(indexInClique, 1);
            await user.save();

            indexInClique = friend.Clique.indexOf(user._id);
            friend.Clique.splice(indexInClique, 1);
            await friend.save();

            ret = {id: friend._id};
        }
        catch(e) {
            ret = {error: e.message};
            res.status(200).json(ret);
            return;
        }

        // Send back newly refreshed <accessToken>
        let refreshedToken;
        try {
            refreshedToken = jwt.refresh(accessToken);
        }
        catch(e) {
            console.log(e.message);
        }

        ret = Object.assign(ret, refreshedToken);
        res.status(200).json(ret);
    });

    
    app.post('/api/editProfile', async(req, res, next) => {
        // Incoming: firstName, lastName, email, username, password
        // Outgoing: error

        let ret, userExists;
        const { firstName, lastName, email, username, password } = req.body;

        userExists = await User.findOne().or([{Username: username}, {Email: email}]);
        if (!userExists) {
            ret = {error: 'A user with that username does not exists'};
           
            res.status(200).json(ret);
            return;
        }

        // if the user does exist update its fields with either same or old information
        userExists = {
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Username: username,
            Password: password
        };

        await userExists.save();
        res.status(200).json(ret);
    });
}