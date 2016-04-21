var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        type: String
    },
    loginname: {
        type: String
    },
    pass: {
        type: String
    },
    email: {
        type: String
    },
    avatar: {
        type: String
    },
    active: {
        type: Boolean,
        default: false
    },
    frozen: {
        type: Boolean,
        default: false
    }
});


mongoose.model('User', UserSchema);