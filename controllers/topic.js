var EventProxy = require('eventproxy');
var topicManager = require('../managers/topic');
var userManager = require('../managers/user');


/**
 * Topic page
 *
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 * @param  {Function} next
 */
exports.index = function(req, res, next) {
    var topic_id = req.params.tid;
    var ep = new EventProxy();
    ep.on('topic', function(topic) {
         if (topic && topic.author) {
            topic.visit_count += 1;
            topic.save();
        } else {
            return res.render404('此话题不存在或已被删除。');
        }
        res.render('topic/index', {
            topic: topic
        });
    });
    ep.fail(next);
    topicManager.getFullTopic(topic_id, ep.done('topic'));
};

exports.create = function(req, res, next) {
    res.redirect('/topic/edit');
};

exports.put = function(req, res, next) {
    var title = req.body.title;
    var content = req.body.content;
    var ep = new EventProxy();
    ep.all('topic', 'user', function(topic, user) {
        user.topic_count += 1;
        user.save();
        req.session.user = user;
        res.redirect('/topic/' + topic._id);
    });
    ep.fail(next);
    topicManager.newAndSave(title, content, req.session.user._id, ep.done('topic'));
    userManager.getUserById(req.session.user._id, ep.done('user'));
};