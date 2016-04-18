var manager = require('../managers');
var replyManager = manager.reply;
var EventProxy = require('eventproxy');

exports.add = function(req, res, next) {
    var content = req.body.r_content;
    var topic_id = req.params.topic_id;

    var ep = new EventProxy();
    ep.all('reply', function(reply) {
        res.redirect('/t/' + topic_id);
    });
    ep.fail(next);
    replyManager.newAndSave(content, topic_id, null, ep.done('reply'));
};