var EventProxy = require('eventproxy');
var topicManager = require('../managers/topic');
var replyManager = require('../managers/reply');
var userManager = require('../managers/user');
var validator = require('validator');


/**
 * Topic page
 *
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 * @param  {Function} next
 */
exports.index = function(req, res, next) {

    var topic_id = req.params.tid;

    if (topic_id.length !== 24) {
        return res.render404('此话题不存在或已被删除。');
    }
    var events = ['topic', 'other_topics'];
    var ep = EventProxy.create(events,
        function(topic, other_topics) {
            res.render('topic/index', {
                topic: topic,
                author_other_topics: other_topics
            });
        });

    ep.fail(next);

    topicManager.getFullTopic(topic_id, ep.done(function(message, topic, author, replies) {
        if (message) {
            ep.unbind();
            return res.renderError(message);
        }

        topic.visit_count += 1;
        topic.save();

        topic.author = author;
        topic.replies = replies;

        ep.emit('topic', topic);
        // get other_topics
        var options = {
            limit: 5,
            sort: '-last_reply_at'
        };
        var query = {
            author_id: topic.author_id,
            _id: {
                '$nin': [topic._id]
            }
        };
        topicManager.getTopicsByQuery(query, options, ep.done('other_topics'));
    }));
};


exports.create = function(req, res, next) {
    res.render('topic/edit', {});
};

exports.put = function(req, res, next) {
    var title = validator.trim(req.body.title);
    var content = validator.trim(req.body.content);


    // 验证
    var editError;
    if (title === '') {
        editError = '标题不能是空的。';
    } else if (title.length < 5 || title.length > 141) {
        editError = '标题字数太多或太少。';
    }
    // END 验证

    if (editError) {
        res.status(422);
        return res.render('topic/edit', {
            edit_error: editError,
            title: title,
            content: content
        });
    }
    topicManager.newAndSave(title, content, req.session.user._id, function(err, topic) {
        if (err) {
            return next(err);
        }

        var proxy = new EventProxy();

        proxy.all('score_saved', function() {
            res.redirect('/topic/' + topic._id);
        });
        proxy.fail(next);
        userManager.getUserById(req.session.user._id, proxy.done(function(user) {
            //user.score += 5;
            user.topic_count += 1;
            user.save();
            req.session.user = user;
            proxy.emit('score_saved');
        }));
    });
};