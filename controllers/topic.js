var EventProxy = require('eventproxy');
var manager = require('../managers');
var topicManager = manager.topic;
var replyManager = manager.reply;


/**
 * Topic page
 *
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 * @param  {Function} next
 */
exports.index = function (req, res, next) {

  var topic_id = req.params.tid;
  if (topic_id.length !== 24) {
    return res.render404('此话题不存在或已被删除。');
  }
  var events = ['topic'];
  var ep = EventProxy.create(events, function (topic) {
    res.render('topic/index', {
      topic: topic,
    });
  });

  ep.fail(next);

  topicManager.getFullTopic(topic_id, ep.done(function (message, topic, author, replies) {
    if (message) {
      ep.unbind();
      return res.renderError(message);
    }

    topic.visit_count += 1;
    topic.save();

    topic.author  = author;
    topic.replies = replies;

    ep.emit('topic', topic);

  }));
};


exports.create = function (req, res, next) {
  res.render('topic/edit', {
  });
};

exports.put = function (req, res, next) {
  var title   = validator.trim(req.body.title);
  var content = validator.trim(req.body.t_content);

  // 得到所有的 tab, e.g. ['ask', 'share', ..]
  var allTabs = config.tabs.map(function (tPair) {
    return tPair[0];
  });

  // 验证
  var editError;
  if (title === '') {
    editError = '标题不能是空的。';
  } else if (title.length < 5 || title.length > 100) {
    editError = '标题字数太多或太少。';
  }
  // END 验证

  if (editError) {
    res.status(422);
    return res.render('topic/edit', {
      edit_error: editError,
      title: title,
      content: content,
      tabs: config.tabs
    });
  }

  Topic.newAndSave(title, content, tab, req.session.user._id, function (err, topic) {
    if (err) {
      return next(err);
    }

    var proxy = new EventProxy();

    proxy.all('score_saved', function () {
      res.redirect('/topic/' + topic._id);
    });
    proxy.fail(next);
    User.getUserById(req.session.user._id, proxy.done(function (user) {
      user.score += 5;
      user.topic_count += 1;
      user.save();
      req.session.user = user;
      proxy.emit('score_saved');
    }));

    //发送at消息
    at.sendMessageToMentionUsers(content, topic._id, req.session.user._id);
  });
};

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