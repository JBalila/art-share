require('express');
require('mongodb');

const userEndpoints = require('./endpoints/userEndpoints');
const postEndpoints = require('./endpoints/postEndpoints');
const commentEndpoints = require('./endpoints/commentEndpoints');

exports.setApp = function(app, client) {
    userEndpoints.setUserEndpoints(app, client);
    postEndpoints.setPostEndpoints(app, client);
    commentEndpoints.setCommentEndpoints(app, client);
}