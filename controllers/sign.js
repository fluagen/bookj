var validator = require('validator');
var EventProxy = require('eventproxy');
var config = require('../config');
var tools = require('../common/tools');
var userManager = require('../managers/user');

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
    ep.on('success_user', function(user) {
        res.render('sign/signup', {
            success: '欢迎加入！我们已给您的注册邮箱' + user.email + '发送了一封邮件，请点击里面的链接来激活您的帐号。'
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
    if (pass.length < 6) {
        ep.emit('prop_err', '密码至少需要6个字符。');
        return;
    }

    ep.on('reapt_user', function(users) {
        if (users.length > 0) {
            ep.emit('prop_err', '用户名或邮箱已被使用。');
            return;
        }
        tools.bhash(pass, ep.done(function(passhash) {
            var avatarUrl = tools.makeGravatar(email);
            userManager.newAndSave(loginname, passhash, email, avatarUrl, false, ep.done('success_user'));

        }));
    });
    var query = {
        '$or': [{
            'loginname': loginname
        }, {
            'email': email
        }]
    };
    userManager.getUsersByQuery(query, {}, ep.done('reapt_user'));
};

/**
 * Show user login page.
 *
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 */
exports.showLogin = function(req, res) {
    req.session._loginReferer = req.headers.referer;
    res.render('sign/signin');
};

/**
 * define some page when login just jump to the home page
 * @type {Array}
 */
var notJump = [
  '/active_account', //active page
  '/reset_pass',     //reset password page, avoid to reset twice
  '/signup',         //regist page
  '/search_pass'    //serch pass page
];


exports.login = function(req, res, next) {
    var loginname = validator.trim(req.body.loginname).toLowerCase();
    var pass = validator.trim(req.body.pass);
    var ep = new EventProxy();

    ep.fail(next);

    if (!loginname || !pass) {
        res.status(422);
        return res.render('sign/signin', {
            error: '信息不完整。'
        });
    }

    var getUser;
    if (loginname.indexOf('@') !== -1) {
        getUser = userManager.getUserByMail;
    } else {
        getUser = userManager.getUserByLoginName;
    }

    ep.on('login_error', function(login_error) {
        res.status(403);
        res.render('sign/signin', {
            error: '用户名或密码错误'
        });
    });

    getUser(loginname, function(err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return ep.emit('login_error');
        }
        var passhash = user.pass;
        tools.bcompare(pass, passhash, ep.done(function(bool) {
            if (!bool) {
                return ep.emit('login_error');
            }
            if (!user.active) {
                res.status(403);
                return res.render('sign/signin', {
                    error: '此帐号还没有被激活，激活链接已发送到 ' + user.email + ' 邮箱，请查收。'
                });
            }
            // store session cookie
            //authMiddleWare.gen_session(user, res);
            //check at some page just jump to home page
            var refer = req.session._loginReferer || '/';
            for (var i = 0, len = notJump.length; i !== len; ++i) {
                if (refer.indexOf(notJump[i]) >= 0) {
                    refer = '/';
                    break;
                }
            }
            res.redirect(refer);
        }));
    });
};