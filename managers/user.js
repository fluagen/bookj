var models = require('../models');
var User = models.User;
var EventProxy = require('eventproxy');

exports.newAndSave = function(loginId, password, email, callback) {
    var user = new User();
    user.loginId = loginId;
    user.password = password;
    user.email = email;
    user.save(callback);
};

exports.getUserById = function(id, callback) {
    var query = User.findOne({
        _id: id
    });
    var ep = new EventProxy();
    ep.all('user', function(user){
    	callback(null, user);
    });
    ep.fail(callback);
    query.exec(ep.done('user'));
};