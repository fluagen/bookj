var models = require('../models');
var User = models.User;
var EventProxy = require('eventproxy');
var tools = require('../common/tools');

/**
 * 根据登录名查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} loginName 登录名
 * @param {Function} callback 回调函数
 */
exports.getUserByLoginName = function(loginName, callback) {
    User.findOne({
        'loginname': loginName
    }, callback);
};

/**
 * 根据用户ID，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} id 用户ID
 * @param {Function} callback 回调函数
 */
exports.getUserById = function(id, callback) {
    if (!id) {
        return callback();
    }
    User.findOne({
        _id: id
    }, callback);
};

/**
 * 根据用户ID列表，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {Array} ids 用户ID列表
 * @param {Function} callback 回调函数
 */
exports.getUsersByIds = function(ids, callback) {
    User.find({
        '_id': {
            '$in': ids
        }
    }, callback);
};

/**
 * 根据邮箱，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} email 邮箱地址
 * @param {Function} callback 回调函数
 */
exports.getUserByMail = function(email, callback) {
    User.findOne({
        email: email
    }, callback);
};

/**
 * 根据关键字，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {String} query 关键字
 * @param {Object} opt 选项
 * @param {Function} callback 回调函数
 */
exports.getUsersByQuery = function(query, opt, callback) {
    User.find(query, '', opt, callback);
};


exports.newAndSave = function(loginname, pass, email, avatar_url, callback) {
    if (typeof active === 'function') {
        callback = active;
        active = false;
    }
    
    active = true;

    var user = new User();
    user.loginname = loginname;
    user.pass = pass;
    user.email = email;
    user.avatar = avatar_url;
    user.active = active || false;
    user.accessToken = uuid.v4();

    user.save(callback);
};

exports.getGravatar = function(user) {
    return user.avatar || tools.makeGravatar(user.email);
};