var managers = require('../managers');
var articleManager = managers.article;


exports.index = function(req, res, next) {
    console.log("manuscript index");
    //获取公开的手稿
    var query = {
        'public': true
    };
    articleManager.list(query, function(err, rst) {
        res.render('index', {
            articles: rst
        });
    });
    //显示
    console.log("manuscript indexw");
};

exports.showPrivate = function(req, res, next) {

};

exports.create = function(req, res, next) {
	console.log('article create');
    res.render('a/edit', {});
};

exports.edit = function(req, res, next) {

};

exports.put = function(req, res, next) {
    var title = req.body.title;
    var description = req.body.description;
    var public = true;
    var content = req.body.content;

    articleManager.newAndSave(title, description, public, content, function(err, rst) {
        res.redirect('/', {
            articles: rst
        });

    });
};