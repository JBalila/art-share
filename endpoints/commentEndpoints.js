require('express')
require('mongodb')

const jwt = require('../createJWT');
const Comment = require('../models/Comment');

exports.setCommentEndpoints = function(app, client) {
    +    app.post('/api/addComment', async(req, res, next) => {
        // Incoming: username (Username of logged-in user), post to add comment to, comment string and accessToken
        // Outgoing: _id of post + accessToken OR error

        let ret; 
        const { author, post, comment} = req.body;
        
      let newComment = new  Comment({
            PostID: post,
            AuthorID: author,
            Text: comment
           
      })

        await newComment.save();
        res.status(200).json(ret);

    });

    app.post('/api/likeComment', async(req, res, next) => {

      let ret, comment;
      const {commentID, likedBy} = req.body;

      comment = Comment.findOne({_id: commentID});
      if (comment) {
        comment.Likes++;
        comment.LikedBy.push(likedBy._id);
        await comment.save();
      }
      else{
        ret = {error: 'Comment not found'}
      }

      res.status(200).json(ret);
    });

    app.post('/api/unlikeComment', async(req, res, next) => {

      let ret, comment;
      const {commentID, likedBy} = req.body;

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
      
      res.status(200).json(ret);
    });
}