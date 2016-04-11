var manager = require('../managers');
var topicManager = manager.topic;

exports.index = function(req, res, next) {
    var query = {
        'public': true
    };
    topicManager.list(query, function(err, rst) {
        res.render('index', {
            topics: rst
        });
    });
};