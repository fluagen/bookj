var validator = require('validator');
var EventProxy = require('eventproxy');
var config = require('../config');
var userManager = require('../managers').user;
var tools = require('../common/tools');

//sign up
exports.showSignup = function(req, res) {
    res.render('sign/signup');
};

exports.signup = function(req, res, next) {
    var loginname = req.body.loginname;
    var email = req.body.email;
    var pass = req.body.pass;
    var rePass = req.body.re_pass;

    var ep = new EventProxy();
    ep.fail(next);
    ep.on('prop_err', function(msg) {
        res.status(422);
        res.render('sign/signup', {
            error: msg,
            loginname: loginname,
            email: email
        });
    });

    // 验证信息的正确性
    if ([loginname, pass, rePass, email].some(function(item) {
        return item === undefined || item === '';
    })) {
        ep.emit('prop_err', '信息不完整。');
        return;
    }
    loginname = validator.trim(loginname).toLowerCase();
    email = validator.trim(email).toLowerCase();
    pass = validator.trim(pass);
    rePass = validator.trim(rePass);

    if (loginname.length < 6) {
        ep.emit('prop_err', '用户名至少需要6个字符。');
        return;
    }
    if (!tools.validateId(loginname)) {
        return ep.emit('prop_err', '用户名不合法。');
    }
    if (!validator.isEmail(email)) {
        return ep.emit('prop_err', '邮箱不合法。');
    }
    if (pass !== rePass) {
        return ep.emit('prop_err', '两次密码输入不一致。');
    }
    if(pass.length < 6){
        ep.emit('prop_err', '密码至少需要6个字符。');
        return;
    }
    // END 验证信息的正确性


    userManager.getUsersByNameOrEmail(loginname, email, function(err, users) {
        if (err) {
            next(err);
        }
        if (users.length > 0) {
            ep.emit('prop_err', '用户名或邮箱已被使用。');
            return;
        }
        tools.bhash(pass, ep.done(function(passhash) {
            // create gravatar
            var avatarUrl = tools.makeGravatar(email);
            userManager.newAndSave(loginname, passhash, email, avatarUrl, function(err) {
                if (err) {
                    return next(err);
                }
                res.render('sign/signup', {
                    success: '欢迎加入 '
                });
            });
        }));
    });

};