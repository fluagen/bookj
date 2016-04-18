var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var LocalAuthScheme = new Schema({
    user_id: ObjectId,
    loginId: {
        type: String
    },
    passwd: {
        type: String
    }
});


mongoose.model('LocalAuth', LocalAuthScheme);