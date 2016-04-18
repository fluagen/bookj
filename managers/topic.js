var models = require('../models');
var Topic = models.Topic;
var EventProxy = require('eventproxy');

exports.getFullTopic = function(id, callback) {

    var q = Topic.findOne({
        _id: id,
        deleted: false
    });

    var ep = new EventProxy();
    ep.all('topic', function(topic){
        callback(null, topics);
    });
    ep.fail(callback);
    q.exec(ep.done('topic'));
};

exports.list = function(query, callback) {
    var q = Topic.find(query);

    var ep = new EventProxy();
    ep.all('topics', function(topics){
        callback(null, topics);
    });
    ep.fail(callback);
    q.exec(ep.done('topics'));
    
};

exports.newAndSave = function(title, description, org_ids, content, callback) {
    var topic = new Topic();
    topic.title = title;
    topic.description = description;
    topic.org_ids = org_ids;
    topic.content = content;
    topic.save(callback);
};