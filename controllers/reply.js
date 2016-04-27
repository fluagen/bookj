var topicManager = require('../managers/topic');
var replyManager = require('../managers/reply');
var EventProxy = require('eventproxy');

exports.add = function(req, res, next) {
    var content = req.body.r_content;
    var topic_id = req.params.topic_id;
var current_user = req.session.user;
    var ep = new EventProxy();
    ep.all('reply', function(reply) {
        res.redirect('/topic/' + topic_id);
    });
    ep.fail(next);
    replyManager.newAndSave(content, topic_id, current_user._id, ep.done(function(reply) {
        topicManager.updateLastReply(topic_id, reply._id, function(err) {
            if (err) {
                return next(err);
            }
            ep.emit('reply', reply);
        });
    }));
};