require('express')
require('mongodb')

const jwt = require('../createJWT');
const Post = require('../models/Post');

exports.setPostEndpoints = function(app, client) {
    app.post('/api/feed', async(req, res, next) => {
        
        const { clique } = req.body;

        let postArray = await Post.find().or([{isPublic: true}, {AuthorId: {$in: clique}}]);
        
        res.status(200).json(postArray);
    })
}