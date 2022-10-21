require('express');
require('mongodb');

exports.setApp = function(app, client) {
    app.post('/api/login', async (req, res, next) => {
        // Incoming: username, password
        // Outgoing: _id, FirstName, LastName, Email, Username, Password,
        //           TimeCreated, Clique[], ProfilePublic, SentRequests[],
        //           PendingRequests[], error

        let error = '';
        const { username, password } = req.body;

        const db = client.db('Art-Share');
        let result = await db.collection('Users').findOne({Username: username, Password: password});

        let _id = -1;
        let fn = '';
        let ln = '';

        if (result)
            ret = result;
        else
            ret = { error: 'Incorrect username/password combination' };

        res.status(200).json(ret);
    });
}