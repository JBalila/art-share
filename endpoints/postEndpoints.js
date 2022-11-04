require('express')
require('mongodb')

const jwt = require('../createJWT');
const Post = require('../models/Post');

exports.setPostEndpoints = function(app, client) {
    app.post('/api/feed', async(req, res, next) => {
        
        const { clique } = req.body;

        let postArray = await Post.find().or([{isPublic: true}, {AuthorId: {$in: clique}}]);
        
        res.status(200).json(postArray);
    });

    app.post('/api/addPost', async(req, res, next) => {
        // Incoming: Post information
        // Outgoing: Error

        let ret;
        const { image, authorID, title, description, ispublic } = req.body;

        let postExists = await Post.findOne({Title: title});
        if (postExists) {
            ret = {error: 'A post with that title already exists'}

            res.status(200).json(ret);
            return;
        }

        let newPost = new Post({
            Image: image,
            AuthorID: authorID,
            Title: title,
            Description: description,
            IsPublic: ispublic
        });

        await newPost.save();

        ret = {error: ''};
        res.status(200).json(ret);
    });

    app.post('/api/editPost', async(req, res, next) => {
        // Incoming: _id of post to update
        // Outgoing: Error

        let ret;
        const { postID, title, description, ispublic } = req.body;

        let post = await Post.findOne({_id: postID});
        if (!post) {
            ret = {error: 'Post not found'};

            res.status(200).json(ret);
            return;
        }

        post.Title = title;
        post.Description = description;
        post.IsPublic = ispublic;
        await post.save();

        ret = {error: ''};
        res.status(200).json(ret);
    });

    app.post('/api/likePost', async(req, res, next) => {
        // Incoming: postID to find post, name of person who liked post
        // Outgoing: Error

        let ret;
        const { postID, userID } = req.body;

        // Check if post exists
        let post = await Post.findOne({_id: postID});
        if (!post) {
            ret = {error: 'Post not found'};

            res.status(200).json(ret);
            return;
        }

        // Check if User has already liked the post
        if (post.LikedBy.includes(userID)) {
            ret = {error: 'You have already liked this post'};

            res.status(200).json(ret);
            return;
        }

        post.Likes++; 
        post.LikedBy.push(userID);
        await post.save();

        ret = {error: ''};
        res.status(200).json(ret);
    });

    app.post('/api/unlikePost', async(req, res, next) => {
        // Incoming: postID to find post, name of person who liked post
        // Outgoing: Error 

        let ret;
        const { postID, userID } = req.body;

        let post = await Post.findOne({_id: postID});
        if (!post) {
            ret = {error: 'Post not found'};

            res.status(200).json(ret);
            return;
        }

        let indexInLikedBy = post.LikedBy.indexOf(userID);
        if (indexInLikedBy < 0) {
            ret = {error: 'You have not liked this post'};

            res.status(200).json(ret);
            return;
        }

        post.Likes--;
        post.LikedBy.splice(indexInLikedBy, 1);
        await post.save();

        ret = {error: ''};
        res.status(200).json(ret);
    });
}

