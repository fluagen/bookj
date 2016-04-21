var models = require('../models');
var Topic = models.Topic;
var EventProxy = require('eventproxy');

exports.getFullTopic = function(id, callback) {

    var q = Topic.findOne({
        _id: id,
        deleted: false
    });

    var ep = new EventProxy();
    ep.all('topic', function(topic) {
        callback(null, topic);
    });
    ep.fail(callback);
    q.exec(ep.done('topic'));
};

exports.list = function(query, callback) {
    var q = Topic.find(query);

    var ep = new EventProxy();
    ep.all('topics', function(topics) {
        callback(null, topics);
    });
    ep.fail(callback);
    q.exec(ep.done('topics'));

};

exports.getTopicsByQueryForPaging = function(query, skip, limit, callback) {
    var q = Topic.find(query);
    q.skip(skip).limit(limit);

    // var ep = new EventProxy();
    // ep.all('topics', function(topics) {
    //     callback(null, topics);
    // });
    // ep.fail(callback);
    q.exec(function(err, topics) {
        if (err) {
            return callback(err);
        }
        if (topics.length === 0) {
            return callback(null, []);
        }
        var proxy = new EventProxy();
        proxy.after('topic_ready', topics.length, function() {
            topics = _.compact(topics); // 删除不合规的 topic
            return callback(null, topics);
        });
        proxy.fail(callback);
        topics.forEach(function(topic, i) {
            var ep = new EventProxy();
            ep.all('author', 'reply', function(author, reply) {
                // 保证顺序
                // 作者可能已被删除
                if (author) {
                    topic.author = author;
                    topic.reply = reply;
                } else {
                    topics[i] = null;
                }
                proxy.emit('topic_ready');
            });

            User.getUserById(topic.author_id, ep.done('author'));
            // 获取主题的最后回复
            Reply.getReplyById(topic.last_reply, ep.done('reply'));
        });

    });

};

exports.newAndSave = function(title, description, org_ids, content, callback) {
    var topic = new Topic();
    topic.title = title;
    topic.description = description;
    topic.org_ids = org_ids;
    topic.content = content;
    topic.save(callback);
};