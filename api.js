require('express');
require('mongodb');

const User = require('./models/User.js');

exports.setApp = function(app, client) {
    app.post('/api/login', async (req, res, next) => {
        // Incoming: username, password
        // Outgoing: User object

        let error = '';
        const { username, password } = req.body;

        let result = await User.findOne({Username: username, Password: password});

        if (result)
            ret = result;
        else
            ret = { error: 'Incorrect username/password combination' };

        res.status(200).json(ret);
    });
}