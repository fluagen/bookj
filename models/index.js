var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.db, {
    server: {
        poolSize: 20
    }
}, function(err) {
    if (err) {
        console.error('connect to %s error: ', config.db, err.message);
        process.exit(1);
    }
});

// models
require('./topic');
require('./reply');
require('./user');
require('./group');
require('./message');

exports.Topic = mongoose.model('Topic');
exports.Reply = mongoose.model('Reply');
exports.User = mongoose.model('User');
exports.Group = mongoose.model('Group');
exports.Message = mongoose.model('Message');
