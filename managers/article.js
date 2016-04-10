var models = require('../models');
var Article = models.Article;


exports.list = function(query, callback) {
    var q = Article.find(query);

    q.exec(function(err, articles) {
        if (err) {
            return callback(err);
        }
        if (articles.length == 0) {
            return callback(null, []);
        }
        return callback(null, articles);
    });
};

exports.newAndSave = function(title, description, public, content, callback) {
    var article = new Article();
    article.title = title;
    article.description = description;
    article.public = public;
    article.content = content;
    article.save(callback);
};