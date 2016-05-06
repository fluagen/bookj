var EventProxy = require('eventproxy');
var topicManager = require('../managers/topic');
var config = require('../config');


exports.index = function(req, res, next) {
    var ep = new EventProxy();
    ep.all('topics', function(topics) {
        res.render('index', {
            topics: topics
        });
    });
    var query = {};
    var limit = config.list_topic_count;
    var options = {
        sort: '-last_reply_at'
    };
    ep.fail(next);
    topicManager.getTopicsByQuery(query, options, ep.done('topics'));
};
