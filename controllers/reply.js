var topicManager = require('../managers/topic');
var replyManager = require('../managers/reply');
var userManager = require('../managers/user');
var EventProxy = require('eventproxy');
var at = require('../common/at');

exports.add = function(req, res, next) {
    var content = req.body.r_content;
    var topic_id = req.params.tid;
    var cu = req.session.user;
    var ep = new EventProxy();
    ep.fail(next);

    ep.all('topic', function(topic) {
        if (!topic) {
            return res.status(403).send('此话题不存在或已被删除。');
        }
        replyManager.newAndSave(content, topic_id, cu._id, ep.done('reply_saved'));
    });

    ep.all('topic', 'reply_saved', function(topic, reply) {
        //发送at消息，并防止重复 at 作者
        var newContent = content.replace('@' + topic.author.loginname + ' ', '');
        at.sendMessageToMentionUsers(newContent, topic_id, cu._id, reply._id, ep.done('at'));

        userManager.getUserById(cu._id, ep.done('user_updated', function(user) {
            user.reply_count += 1;
            user.save();
            req.session.user = user;
        }));
        topicManager.updateLastReply(topic_id, reply._id, ep.done('topic_updated'));
    });

    ep.all('reply_saved', 'user_updated', 'topic_updated', function() {
        res.redirect('/topic/' + topic_id);
    });
    topicManager.getTopicById(topic_id, ep.done('topic'));
};