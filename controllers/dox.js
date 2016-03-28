var fs = require('fs');
var path = require('path');
var ejs = require('ejs');
var markdown = require('marked').parse;
var ncp = require('ncp').ncp;

/**
 * 从Markdown中提取标题列表
 * @return {Array} 返回标题列表
 */
var getIndexs = function(section, level, filter) {
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

var templates;
var getTemplates = function(skin) {
    if (templates) {
        return templates;
    }
    var doc;
    if (!skin) {
        skin = 'default';
    }
    var filename = path.join(__dirname, '../templates/' + skin + '/index.html');
    doc = fs.readFileSync(path.join(__dirname, '../templates/' + skin + '/doc.html'), 'utf8');

    templates = {
        'doc': doc,
        'filename': filename
    };
    return templates;
};


var build = function(output, sink, ctx) {
    var content = ctx.content;

    var doc = getTemplates(sink).doc;

    var obj = {};
    obj.name = 'test';
    obj.description = 'test';
    obj.indexs = getIndexs(content);
    obj.content = markdown(content);
    obj.filename = path.join(__dirname, '../templates/' + sink + '/index.html');

    fs.writeFileSync(path.join(output, 'index.html'), ejs.render(doc, obj), 'utf-8');

};

exports.create = function(req, res, next) {
    var author = req.body.author;
    var version = req.body.version;
    var content = req.body.content;
    var ctx = {};
    ctx.content = content;
    var output = path.join(__dirname, '../view/doc');
    var sink = 'default';
    build(output, sink, ctx);
    next();
};