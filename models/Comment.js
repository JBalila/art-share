const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    PostID: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    AuthorID: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    Timestamp: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    Text: {
        type: String,
        required: true
    },
    Likes: {
        type: Number,
        default: 0
    },
    LikedBy: {
        type: [mongoose.SchemaTypes.ObjectId],
        default: []
    }
});

module.exports = Comment = mongoose.model('Comment', CommentSchema, 'Comments');