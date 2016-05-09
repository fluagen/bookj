var topicManager = require('../managers/topic');
var replyManager = require('../managers/reply');
var EventProxy = require('eventproxy');
var at = require('../common/at');

exports.add = function(req, res, next) {
    var content = req.body.r_content;
    var topic_id = req.params.tid;
    var ep = new EventProxy();
    var current_user = req.session.user;

    ep.fail(next);


    ep.all('topic', 'linkUsers', function(topic, linkedContent) {
        if (!topic || !topic.author) {
            return res.status(403).send('此话题不存在或已被删除。');
        }
        replyManager.newAndSave(linkedContent, topic_id, current_user._id, ep.done(function(reply) {
            topicManager.updateLastReply(topic_id, reply._id, function(err, topic) {
                if (err) {
                    return next(err);
                }
                //发送at消息，并防止重复 at 作者
                var newContent = linkedContent.replace('@' + topic.author.loginname + ' ', '');
                at.sendMessageToMentionUsers(newContent, topic_id, current_user._id, reply._id);
                ep.emit('reply_saved', reply);
            });
        }));
    });
    topicManager.getTopicById(topic_id, ep.done('topic'));
    at.linkUsers(content, ep.done('linkUsers'));

    ep.all('reply_saved', function(reply) {
            userManager.getUserById(current_user._id, ep.done(function(user) {
                    user.reply_count += 1;
                    user.save();
                    req.session.user = user;

                    ep.emit('reply', reply);
                }));
            });

    ep.all('reply', function(reply) {
        res.redirect('/topic/' + topic_id);
    });
};