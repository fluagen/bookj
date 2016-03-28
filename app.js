var config = require('./config');

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var webRouter = require('./web_router');
var Loader = require('loader');


var app = express();

//静态文件目录
var staticDir = path.join(__dirname, 'public');

//设置环境上下文
app.engine('html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//静态资源
app.use('/public',express.static(staticDir));



//中间件
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

//assets
var assets = {};

//set static, dynamic helpers
_.extend(app.locals, {
    config: config,
    Loader: Loader,
    assets: assets
});

app.use('/', webRouter);

app.listen(config.port,function(){
	console.log('this is server started');
});