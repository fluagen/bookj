var managers = require('../managers');
var topicManager = managers.topic;


exports.index = function(req, res, next) {
    var topic_id = req.params.tid;
    topicManager.getFullTopic(topic_id, function(err, rst) {
        res.render('topic/index', {
            topic: rst
        });
    });
};

exports.showPrivate = function(req, res, next) {

};

exports.create = function(req, res, next) {
    console.log('article create');
    res.render('topic/edit', {});
};

exports.edit = function(req, res, next) {

};

exports.put = function(req, res, next) {
    var title = req.body.title;
    var description = req.body.description;
    var public = true;
    var content = req.body.content;

    topicManager.newAndSave(title, description, public, content, function(err, rst) {
        res.redirect('/');

    });
};