var models = require('../models');
var Reply = models.Reply;
var EventProxy = require('eventproxy');

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

exports.getRepliesByTopicId = function(id, callback) {
    var query = Reply.find({
        topic_id: id,
        deleted: false
    });
    query = query.sort('create_at');
    var ep = new EventProxy();
    ep.all('replies', function(replies) {
        callback(null, replies);
    });
    ep.fail(callback);

    query.exec(ep.done('replies'));

};