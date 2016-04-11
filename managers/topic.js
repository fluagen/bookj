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
        return callback(null, topics);
    });
};

exports.newAndSave = function(title, description, public, content, callback) {
    var topic = new Topic();
    topic.title = title;
    topic.description = description;
    topic.public = public;
    topic.content = content;
    topic.save(callback);
};