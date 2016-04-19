var manager = require('../managers');
var userManager = manager.user;
var EventProxy = require('eventproxy');

exports.add = function(req, res, next) {
    var loginId = req.body.loginId;
    var password = req.body.password;
    var email = req.body.email;

    var ep = new EventProxy();
    ep.all('user', function(user) {
        res.redirect('/');
    });
    ep.fail(next);
    userManager.newAndSave(loginId, password, email, ep.done('user'));
};