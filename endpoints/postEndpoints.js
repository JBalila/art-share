require('express')
require('mongodb')

const jwt = require('../createJWT');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.setPostEndpoints = function(app, client) {
    app.post('/api/feed', async(req, res, next) => {
        
        const { userID, search, displayParams, sortParams, offset, limit } = req.body;

        let sort, displayQuery;

        // Get User object
        let user = await User.findOne({_id: userID});
        if (!user) {
            res = {error: 'This user does not exist'};
            res.status(200).json(ret);
            return;
        }

        // Display requested posts
        switch (displayParams) {
            case "Friends":
                displayQuery = {$or: [{AuthorID: {$in: user.Clique}}]};
                break;
            case "Self":
                displayQuery = {$or: [{AuthorID: user._id}]};
                break;
            default:
                displayQuery = {$or: [{IsPublic: true}, {AuthorID: user._id}, {AuthorID: {$in: user.Clique}}]};
                break;
        }

        // Find posts with <search> in Title
        const regex = new RegExp(`.*${search}.*`);
        const searchQuery = {'Title': {$regex: regex, $options: 'i'}};

        sort = [["TimeCreated", -1]];

        // Sort images by requested field
        switch (sortParams) {
            case "Likes":
                sort.push(["Likes", -1]);
                break;
            case "Title":
                sort.push(["Title", 1]);
                break;
            default:
                break;
        }

        let postArray = await Post.find()
            .and([searchQuery, displayQuery])
            .collation({locale: 'en'})
            .sort(sort)
            .skip(offset)
            .limit(limit);
        
        res.status(200).json(postArray);
    });

    app.post('/api/addPost', async(req, res, next) => {
        // Incoming: Post information
        // Outgoing: Error

        let ret;
        const { image, authorID, title, description, ispublic, accessToken } = req.body;

        // Check if <accessToken> is expired
        try {
            if (jwt.isExpired(accessToken)) {
                ret = {jwtExpired: 'The JWT is no longer valid'};
                res.status(200).json(ret);
                return;
            }
        }
        catch(e) {
            console.log(e.message);
        }

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

        // Send back newly refreshed <accessToken>
        let refreshedToken;
        try {
            refreshedToken = jwt.refresh(accessToken);
        }
        catch(e) {
            console.log(e.message);
        }

        ret = {};

        ret = Object.assign(ret, refreshedToken);
        res.status(200).json(ret);
    });

    app.delete('/api/deletePost', async(req, res, next) => {
        // Incoming: postID, accessToken
        // Outgoing: error

        let ret;
        const { postID, accessToken } = req.body;

        // Check if <accessToken> is expired
        try {
            if (jwt.isExpired(accessToken)) {
                ret = {jwtExpired: 'The JWT is no longer valid'};
                res.status(200).json(ret);
                return;
            }
        }
        catch(e) {
            console.log(e.message);
        }

        let post = await Post.findOne({_id: postID});
        if (!post) {
            ret = {error: 'Post not found'};

            res.status(200).json(ret);
            return;
        }

        let attachedComments = await Comment.find({PostID: postID});

        // Delete all comments attached to that Post (prevent database cluttering)
        for (const comment of attachedComments) {
            await Comment.deleteOne({_id: comment._id});
        }

        // Finally, delete Post itself
        await Post.deleteOne({_id: postID});

        // Send back newly refreshed <accessToken>
        let refreshedToken;
        try {
            refreshedToken = jwt.refresh(accessToken);
        }
        catch(e) {
            console.log(e.message);
        }

        ret = {};

        ret = Object.assign(ret, refreshedToken);
        res.status(200).json(ret);
    }); 

    app.patch('/api/editPost', async(req, res, next) => {
        // Incoming: _id of post to update
        // Outgoing: Error

        let ret;
        const { postID, title, description, ispublic, accessToken } = req.body;

        // Check if <accessToken> is expired
        try {
            if (jwt.isExpired(accessToken)) {
                ret = {jwtExpired: 'The JWT is no longer valid'};
                res.status(200).json(ret);
                return;
            }
        }
        catch(e) {
            console.log(e.message);
        }

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


        // Send back newly refreshed <accessToken>
        let refreshedToken;
        try {
            refreshedToken = jwt.refresh(accessToken);
        }
        catch(e) {
            console.log(e.message);
        }

        ret = {};

        ret = Object.assign(ret, refreshedToken);
        res.status(200).json(ret);
    });

    app.patch('/api/likePost', async(req, res, next) => {
        // Incoming: postID to find post, name of person who liked post
        // Outgoing: Error

        let ret;
        const { postID, userID, accessToken } = req.body;

        // Check if <accessToken> is expired
        try {
            if (jwt.isExpired(accessToken)) {
                ret = {jwtExpired: 'The JWT is no longer valid'};
                res.status(200).json(ret);
                return;
            }
        }
        catch(e) {
            console.log(e.message);
        }

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

        // Send back newly refreshed <accessToken>
        let refreshedToken;
        try {
            refreshedToken = jwt.refresh(accessToken);
        }
        catch(e) {
            console.log(e.message);
        }

        ret = {};

        ret = Object.assign(ret, refreshedToken);
        res.status(200).json(ret);
    });

    app.patch('/api/unlikePost', async(req, res, next) => {
        // Incoming: postID to find post, name of person who liked post
        // Outgoing: Error 

        let ret;
        const { postID, userID, accessToken } = req.body;

        // Check if <accessToken> is expired
        try {
            if (jwt.isExpired(accessToken)) {
                ret = {jwtExpired: 'The JWT is no longer valid'};
                res.status(200).json(ret);
                return;
            }
        }
        catch(e) {
            console.log(e.message);
        }

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


        // Send back newly refreshed <accessToken>
        let refreshedToken;
        try {
            refreshedToken = jwt.refresh(accessToken);
        }
        catch(e) {
            console.log(e.message);
        }

        ret = {};

        ret = Object.assign(ret, refreshedToken);
        res.status(200).json(ret);
    });
}

