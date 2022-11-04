const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Don't need to add _id field, MongoDB does that automatically
const UserSchema = new Schema({
    Email: {
        type: String,
        required: true,
        lowercase: true
    },
    Username: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    IsVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    TimeCreated: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    Clique: {
        type: [mongoose.SchemaTypes.ObjectId],
        default: [] 
    },
    SentRequests: {
        type: [mongoose.SchemaTypes.ObjectId],
        default: []
    },
    PendingRequests: {
        type: [mongoose.SchemaTypes.ObjectId],
        default: []
    }
});

module.exports = User = mongoose.model('User', UserSchema, 'Users');