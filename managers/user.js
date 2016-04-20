var models = require('../models');
var User = models.User;
var EventProxy = require('eventproxy');

exports.newAndSave = function(loginname, pass, email, avatar, callback) {
    var user = new User();
    user.loginname = loginname;
    user.pass = pass;
    user.email = email;
    user.avatar = avatar;
    user.save(callback);
};

exports.getUserById = function(id, callback) {
    var query = User.findOne({
        _id: id
    });
    query.exec(callback);
};

exports.getUsersByNameOrEmail = function(loginname, email, callback) {
    var query = User.find();
    query = query.or([{
        'loginname': loginname
    }, {
        'email': email
    }]);
    query.exec(callback);
};