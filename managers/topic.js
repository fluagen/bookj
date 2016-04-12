var models = require('../models');
var Topic = models.Topic;

exports.getFullTopic = function(id, callback) {

    var q = Topic.findOne({
        _id: id,
        deleted: false
    });
    q.exec(function(err, topic) {
        callback(null, topic);
    });
};

exports.list = function(query, callback) {
    var q = Topic.find(query);

    q.exec(function(err, topics) {
        if (err) {
            return callback(err);
        }
        if (topics.length === 0) {
            return callback(null, []);
        }
        console.log(topics.length);
        return callback(null, topics);
    });
};

exports.newAndSave = function(title, description, org_ids, content, callback) {
    var topic = new Topic();
    topic.title = title;
    topic.description = description;
    topic.org_ids = org_ids;
    topic.content = content;
    topic.save(callback);
};