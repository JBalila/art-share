require('express')
require('mongodb')

const jwt = require('../createJWT');
const Comment = require('../models/Comment');

exports.setCommentEndpoints = function(app, client) {

}