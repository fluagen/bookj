var fs = require('fs');
var path = require('path');
var ejs = require('ejs');
var markdown = require('marked').parse;
var ncp = require('ncp').ncp;
var mkdirp = require('mkdirp');
var cheerio = require('cheerio');

var config = require('../config');

var getHeaders = function(section, level, filter) {


    level = level || 3; // 默认抽取到三级标题
    level = level > 6 ? 6 : level; // 最大到6级标题
    level = level < 1 ? 1 : level; // 最小到1级标题
    filter = filter || function(item) {
        return true;
    };
    var matched = section.match(/.*\r?\n(\=+)|#+\s+(.*)/gm);
    if (matched) {
        return matched.map(function(item) {
            if (/#+/.test(item)) {
                var level = item.match(/#+/)[0].length;
                var title = item.replace(/#+\s+/, '');
                return {
                    level: level,
                    title: title
                };
            } else {
                return {
                    level: 1,
                    title: item.split(/\n/)[0]
                };
            }
        }).filter(function(item) {
            return item.level <= level;
        }).filter(filter);
    } else {
        return [];
    }
};

var templates = [];
var getTemplate = function(skin) {
    if (templates[skin]) {
        return templates[skin];
    }
    var template = {};

    var doc = fs.readFileSync(path.join(__dirname, '../templates/' + skin + '/doc.html'), 'utf8');

    template.doc = doc;

    templates[skin] = template;
    return template;
};

var getReadme = function(content) {
    var readme = {};
    readme.content = markdown(content);
    readme.headers = getHeaders(content);
    return readme;
};

var process = function(appid, readme, package, skin) {
    if (!skin) {
        skin = 'default';
    }
    var template = getTemplate(skin);
    var docPath = path.join(__dirname, '../doc/' + appid);
    var docPathExists = fs.existsSync(docPath);
    if (!docPathExists) {
        mkdirp.sync(docPath);
    }

    var obj = {};
    obj.filename = path.join(__dirname, '../templates/' + skin + '/index.html');
    obj.content = readme.content;
    obj.headers = readme.headers;
    obj.name = package.name;
    obj.author = package.author;
    obj.description = package.description;
    obj.version = "0.1";

    //homepage
    fs.writeFileSync(path.join(docPath, 'index.html'), ejs.render(template.doc, obj), 'utf8');
    //copy style
    ncp(path.join(__dirname, '../templates/' + skin + '/assets'), path.join(docPath, 'assets'), function() {});

};

exports.build = function(req, res, next) {
    var content = req.body.content;
    var readme = getReadme(content);
    var package = {};
    package.name = "bookj";
    package.author = 'majie';
    package.description = "this is bookj demo";
    var $ = cheerio.load(readme.content);
    $('h1').each(function(i, item) {
        console.log($(item).text());
    });

    process('bookj', readme, package);

    next();

};