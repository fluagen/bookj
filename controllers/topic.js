var EventProxy = require('eventproxy');
var manager = require('../managers');
var topicManager = manager.topic;
var replyManager = manager.reply;


exports.index = function(req, res, next) {
    var topic_id = req.params.tid;
    var ep = EventProxy.create();

    ep.all('topic', 'replies', function(topic, replies) {
        var ctx = {};
        ctx.topic = topic;
        ctx.replies = replies;

        res.render('topic/index', {
            rst: ctx
        });
    });
    ep.fail(next);
    topicManager.getFullTopic(topic_id, ep.done('topic'));
    replyManager.getRepliesByTopicId(topic_id, ep.done('replies'));
};

exports.showPrivate = function(req, res, next) {

};

exports.create = function(req, res, next) {
    res.render('topic/edit');
};

exports.edit = function(req, res, next) {

};

exports.put = function(req, res, next) {
    var title = req.body.title;
    var description = req.body.description;
    var org_id = '';
    var content = req.body.content;
    var ep = EventProxy.create();

    ep.all('topic', function(topic) {
        res.redirect('/t/' + topic._id);
    });
    ep.fail(next);
    topicManager.newAndSave(title, description, org_id, content, ep.done('topic'));
};