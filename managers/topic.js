var models = require('../models');
var Topic = models.Topic;
var EventProxy = require('eventproxy');
var userManager = require('./user');
var replyManager = require('./reply');
var groupManager = require('./group');

var _ = require('lodash');


/**
 * 根据主题ID获取主题
 * Callback:
 * - err, 数据库错误
 * - topic, 主题
 * - author, 作者
 * - lastReply, 最后回复
 * @param {String} id 主题ID
 * @param {Function} callback 回调函数
 */
exports.getTopicById = function(id, callback) {

    var ep = new EventProxy();
    ep.on('topic', function(topic) {
        if (!topic) {
            return callback(null, null);
        }
        ep.all('author', 'reply', 'group', function(author, reply, group) {
            if (!author) {
                return callback(null, null);
            }
            topic.author = author;
            topic.reply = reply;
            topic.group = group;
            return callback(null, topic);
        });
        userManager.getUserById(topic.author_id, ep.done('author'));

        if (topic.last_reply) {
            replyManager.getReplyById(topic.last_reply, ep.done('reply'));
        } else {
            ep.emit('reply', null);
        }
        if (topic.group_id) {
            groupManager.getGroupById(topic.group_id, ep.done('group'));
        } else {
            ep.emit('group', null);
        }

    });
    ep.fail(callback);
    Topic.findOne({
        _id: id
    }, ep.done('topic'));
};




/**
 * 根据关键词，获取主题列表
 * Callback:
 * - err, 数据库错误
 * - topics, 主题列表
 * @param {String} query 搜索关键词
 * @param {Object} opt 搜索选项
 * @param {Function} callback 回调函数
 */
exports.getTopicsByQuery = function(query, opt, callback) {
    var ep = new EventProxy();
    ep.on('topics', function(topics) {

        ep.after('ready_topic', topics.length, function() {
            topics = _.compact(topics); // 删除不合规的 topic
            return callback(null, topics);
        });
        //增加作者、回复、组信息
        topics.forEach(function(topic, i) {
            var proxy = new EventProxy();
            proxy.all('author', 'reply', 'group', function(author, reply, group) {
                if (author) {
                    topic.author = author;
                    topic.reply = reply;
                    topic.group = group;
                } else {
                    topics[i] = null;
                }
                ep.emit('ready_topic');
            });
            proxy.fail(callback);
            userManager.getUserById(topic.author_id, proxy.done('author'));
            if (topic.last_reply) {
                replyManager.getReplyById(topic.last_reply, proxy.done('reply'));
            } else {
                proxy.emit('reply', null);
            }
            if (topic.group_id) {
                groupManager.getGroupById(topic.group_id, proxy.done('group'));
            } else {
                proxy.emit('group', null);
            }
        });
    });
    ep.fail(callback);
    Topic.find(query, '', opt, ep.done('topics'));

};

/**
 * 获取所有信息的主题
 * Callback:
 * - err, 数据库异常
 * - message, 消息
 * - topic, 主题
 * - author, 主题作者
 * - replies, 主题的回复
 * @param {String} id 主题ID
 * @param {Function} callback 回调函数
 */
exports.getFullTopic = function(id, callback) {

    var ep = new EventProxy();
    ep.on('topic', function(topic) {
        if (!topic) {
            return callback(null, null);
        }
        ep.all('author', 'replies', 'group', function(author, replies, group) {
            if (!author) {
                return callback(null, null);
            }
            topic.author = author;
            topic.replies = replies;
            topic.group = group;
            return callback(null, topic);
        });
        userManager.getUserById(topic.author_id, ep.done('author'));
        replyManager.getRepliesByTopicId(topic._id, ep.done('replies'));

        if (topic.group_id) {
            groupManager.getGroupById(topic.group_id, ep.done('group'));
        } else {
            ep.emit('group', null);
        }
    });
    ep.fail(callback);
    Topic.findOne({
        _id: id
    }, ep.done('topic'));

};

/**
 * 更新主题的最后回复信息
 * @param {String} topicId 主题ID
 * @param {String} replyId 回复ID
 * @param {Function} callback 回调函数
 */
exports.updateLastReply = function(topicId, replyId, callback) {
    Topic.findOne({
        _id: topicId
    }, function(err, topic) {
        if (err || !topic) {
            return callback(err);
        }
        topic.last_reply = replyId;
        topic.last_reply_at = new Date();
        topic.reply_count += 1;
        topic.save(callback);
    });
};


/**
 * 将当前主题的回复计数减1，并且更新最后回复的用户，删除回复时用到
 * @param {String} id 主题ID
 * @param {Function} callback 回调函数
 */
exports.reduceCount = function(id, callback) {

    var ep = new EventProxy();
    ep.on('topic', function(topic) {
        topic.reply_count -= 1;
        ep.on('last_reply', function(last_reply) {
            topic.last_reply = last_reply;
            if (!last_reply) {
                topic.last_reply_at = null;
            } else {
                topic.last_reply_at = last_reply.create_at;
            }

            Topic.save(callback);
        });
        replyManager.getLastReplyByTopId(id, ep.done('last_reply'));
    });
    ep.fail(callback);
    ep.findOne({
        _id: id
    }, ep.done('topic'));
};

exports.newAndSave = function(title, content, authorId, callback) {
    var topic = new Topic();
    topic.title = title;
    topic.content = content;
    topic.author_id = authorId;

    topic.save(callback);
};