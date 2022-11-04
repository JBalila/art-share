require('express')
require('mongodb')

const jwt = require('../createJWT');
const Comment = require('../models/Comment');

exports.setCommentEndpoints = function(app, client) {
  +    app.post('/api/addComment', async(req, res, next) => {
      // Incoming: username (Username of logged-in user), post to add comment to, comment string and accessToken
      // Outgoing: _id of post + accessToken OR error

      let ret; 
      const { author, post, comment, accessToken } = req.body;

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
        
      let newComment = new  Comment({
            PostID: post,
            AuthorID: author,
            Text: comment
           
      })

      await newComment.save();

      // Send back newly refreshed <accessToken>
      let refreshedToken;
      try {
          refreshedToken = jwt.refresh(accessToken);
      }
      catch(e) {
          console.log(e.message);
      }

      ret = Object.assign({}, refreshedToken);
      res.status(200).json(ret);
    });

    app.patch('/api/likeComment', async(req, res, next) => {

      let ret, comment;
      const {commentID, likedBy, accessToken} = req.body;

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

      comment = Comment.findOne({_id: commentID});
      if (comment) {
        comment.Likes++;
        comment.LikedBy.push(likedBy._id);
        await comment.save();
      }
      else{
        ret = {error: 'Comment not found'}
      }


      // Send back newly refreshed <accessToken>
      let refreshedToken;
      try {
          refreshedToken = jwt.refresh(accessToken);
      }
      catch(e) {
          console.log(e.message);
      }

      ret = Object.assign({}, refreshedToken);
      res.status(200).json(ret);
    });

    app.patch('/api/unlikeComment', async(req, res, next) => {

      let ret, comment;
      const {commentID, likedBy, accessToken} = req.body;

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

      comment = Comment.findOne({_id: commentID});
      if (post) {
        indexInLikedBy = comment.LikedBy.index0f(likedBy._id);
        if (indexInLikedBy !== -1)
            comment.LikedBy.splice(indexInLikedBy, 1);
        
        comment.Likes--;
        await comment.save();
      }
      else {
        ret = {error: 'Comment not found'};
      }

      // Send back newly refreshed <accessToken>
      let refreshedToken;
      try {
          refreshedToken = jwt.refresh(accessToken);
      }
      catch(e) {
          console.log(e.message);
      }

      ret = Object.assign({}, refreshedToken);
      res.status(200).json(ret);
    });

    app.post('/api/getComments', async(req, res, next) => {
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

      let comments = {comments: await Comment.find({PostID: postID})};

      // Send back newly refreshed <accessToken>
      let refreshedToken;
      try {
          refreshedToken = jwt.refresh(accessToken);
      }
      catch(e) {
          console.log(e.message);
      }

      ret = Object.assign(comments, refreshedToken);
      res.status(200).json(ret);
    });
}