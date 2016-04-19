var models = require('../models');
var User = models.User;
var EventProxy = require('eventproxy');

exports.newAndSave = function(loginname, password, email, callback) {
    var user = new User();
    user.loginname = loginname;
    user.password = password;
    user.email = email;
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
    query = query.or({
        'loginname': loginname
    }, {
        'email': email
    });
    query.exec(callback);
};