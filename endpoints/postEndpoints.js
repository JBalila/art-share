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

    app.post('/api/addPost', async(req, res, next) => {
        // Incoming: Title of post
        // Outgoing: Error

        let ret, postExists;
        const { image, authorID, title, description, ispublic } = req.body;

        postExists = await Post.findOne({Title: title});
        if (postExists) {
            if (postExists.Image === image)
                ret = {error: 'A post with that image already exists'};
            else 
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
        //ret = {Image: image, AuthorID: authorID, Title: title, Description: description, IsPublic: ispublic };
        res.status(200).json(ret);
    });

    app.post('/api/editPost', async(req, res, next) => {
        // Incoming: _id of post to update
        // Outgoing: Error

        let ret, post;
        const { postID, title, description, ispublic } = req.body;

        post = Post.findOne({_id: postID});
        if (post) {
            post.Title = title;
            post.Description = description;
            post.IsPublic = ispublic;
            await post.save();
        }
        else {
            ret = {error: 'Post not found'};
        }
        res.status(200).json(ret);
    });

    app.post('/api/likePost', async(req, res, next) => {
        // Incoming: postID to find post, name of person who liked post
        // Outgoing: Error

        let ret, post;
        const { postID, likedBy } = req.body;

        // If post is found update with one like.
        post = Post.findOne({_id: postID});
        if (post) {
            post.Likes++; 
            post.LikedBy.push(likedBy);
            await post.save();
        }
        else {
            ret = {error: 'Post not found'};
        }
        res.status(200).json(ret);
    });

    app.post('/api/unlikePost', async(req, res, next) => {
        // Incoming: postID to find post, name of person who liked post
        // Outgoing: Error 

        let ret, post;
        const { postID, likedBy } = req.body;

        post = Post.findOne({_id: postID});
        if (post) {
            indexInLikedBy = post.LikedBy.indexOf(likedBy);
            if (indexInLikedBy !== -1) 
                post.LikedBy.splice(indexInLikedBy, 1);
            post.Likes--;
            await post.save();
        }
        else {
            ret = {error: 'Post not found'};
        }
        res.status(200).json(ret);
    });
}

