var fs = require('fs');
var path = require('path');
var ejs = require('ejs');
var markdown = require('marked').parse;
var ncp = require('ncp').ncp;
var mkdirp = require('mkdirp');
var cheerio = require('cheerio');
var _ = require('lodash');

var config = require('../config');

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

var findEnd = function(flatdata, obj) {
    var ends = _.filter(flatdata, function(item) {
        var tag = item.tag;
        var index = item.index;

        return item.index > obj.index && item.depth <= obj.depth;
    });
    var end = {
        index: 9999
    };
    if (ends && ends.length > 0) {
        end = ends[0];
    }
    return end;
};

var findParent = function(flatdata, obj) {
    var parents = _.filter(flatdata, function(item) {
        return item.depth < obj.depth && item.index < obj.index;
    });
    var parent = null;
    if (parents.length > 0) {
        parent = parents[parents.length - 1];
    }
    return parent;
};


var header_id_prefix = "section_index_";
var getReadme = function(content) {
    var readme = {};
    var html = markdown(content);
    var $ = cheerio.load(html, {
        decodeEntities: false
    });
    // fill headers id
    $('h1,h2,h3,h4,h5,h6').each(function(i, item) {
        $(item).attr('id', header_id_prefix + i);
    });
    html = $.html();
    readme.headers = getHeaders(html);
    readme.content = html;
    return readme;
};

var getHeaders = function(html, level) {
    var $ = cheerio.load(html);
    var flatdata = [];
    if (!level) {
        level = 3;
    }
    $('h1,h2,h3').each(function(i, item) {
        var data = {};
        data.index = i;
        data.id = $(item).attr('id');
        data.tag = $(item).prop("name");
        data.depth = parseInt(data.tag.substring(1));
        data.title = $(item).text();
        data.subs = [];
        flatdata.push(data);
    });

    var treedata = [];
    for (var i = 0; i < flatdata.length; i++) {
        var data = flatdata[i];
        if (data.depth == 1) {
            treedata.push(data);
            continue;
        }
        var parent = findParent(flatdata, data);
        if (parent) {
            parent.subs.push(data);
        }
    }
    return treedata;
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

    var ctx = {};
    ctx.filename = path.join(__dirname, '../templates/' + skin + '/index.html');
    ctx.content = readme.content;
    ctx.headers = readme.headers;
    ctx.name = package.name;
    ctx.author = package.author;
    ctx.description = package.description;
    ctx.version = "0.1";

    //homepage
    fs.writeFileSync(path.join(docPath, 'index.html'), ejs.render(template.doc, ctx), 'utf8');
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

    process('bookj', readme, package);

    next();

};