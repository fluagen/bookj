var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        type: String
    },
    loginname: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String
    }
});


mongoose.model('User', UserSchema);