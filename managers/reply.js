var models = require('../models');
var Reply = models.Reply;
var EventProxy = require('eventproxy');
var userManager = require('./user');


/**
 * 获取一条回复信息
 * @param {String} id 回复ID
 * @param {Function} callback 回调函数
 */
exports.getReply = function(id, callback) {
    Reply.findOne({
        _id: id
    }, callback);
};

/**
 * 根据回复ID，获取回复
 * Callback:
 * - err, 数据库异常
 * - reply, 回复内容
 * @param {String} id 回复ID
 * @param {Function} callback 回调函数
 */
exports.getReplyById = function(id, callback) {

    var ep = new EventProxy();
    ep.on('reply', function(reply) {
        ep.on('author', function(author) {
            if (!author) {
                return callback(null, null);
            }
            reply.author = author;
            return callback(null, reply);
        });
        userManager.getUserById(reply.author_id, ep.done('author'));
    });
    ep.fail(callback);
    Reply.findOne({
        _id: id
    }, ep.done('reply'));
};

/**
 * 根据主题ID，获取回复列表
 * Callback:
 * - err, 数据库异常
 * - replies, 回复列表
 * @param {String} id 主题ID
 * @param {Function} callback 回调函数
 */
exports.getRepliesByTopicId = function(id, callback) {

    var ep = new EventProxy();

    ep.on('replies', function(replies) {
        ep.after('ready_reply', replies.length, function() {
            replies = _.compact(replies); // 删除不合规的
            return callback(null, replies);
        });
        replies.forEach(function(reply, i) {
            userManager.getUserById(reply.author_id, function(err, author) {
                if (!err) {
                    return callback(err);
                }
                if (!author) {
                    replies[i] = null;
                } else {
                    reply.author = author;
                }
                ep.emit('ready_reply');
            });
        });
    });
    ep.fail(callback);
    Reply.find({
        topic_id: id
    }, '', {
        sort: 'create_at'
    }, ep.done('replies'));
};

/**
 * 创建并保存一条回复信息
 * @param {String} content 回复内容
 * @param {String} topicId 主题ID
 * @param {String} authorId 回复作者
 * @param {String} [replyId] 回复ID，当二级回复时设定该值
 * @param {Function} callback 回调函数
 */
exports.newAndSave = function(content, topicId, authorId, replyId, callback) {
    if (typeof replyId === 'function') {
        callback = replyId;
        replyId = null;
    }
    var reply = new Reply();
    reply.content = content;
    reply.topic_id = topicId;
    reply.author_id = authorId;

    if (replyId) {
        reply.reply_id = replyId;
    }
    reply.save(callback);
};

/**
 * 根据topicId查询到最新的一条未删除回复
 * @param topicId 主题ID
 * @param callback 回调函数
 */
exports.getLastReplyByTopId = function(topicId, callback) {
  Reply.findOne({topic_id: topicId}, '', {sort: -create_at}, callback);
};
