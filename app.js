var config = require('./config');

var path = require('path');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var _ = require('lodash');
var webRouter = require('./web_router');
var Loader = require('loader');
var RedisStore = require('connect-redis')(session);

var auth = require('./middlewares/auth');


var app = express();

//静态文件目录
var staticDir = path.join(__dirname, 'public');

//设置环境上下文
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));


//静态资源
app.use('/public', express.static(staticDir));



//通用中间件
app.use(bodyParser.json({
    limit: '1mb'
}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '1mb'
}));
app.use(require('cookie-parser')('bookj'));
app.use(session({
    secret: 'bookj',
    resave: true,
    saveUninitialized: true,
    store: new RedisStore({
        port: config.redis_port,
        host: config.redis_host
    })
}));

//自定义中间件
app.use(auth.authUser);
app.use(auth.blockUser());


//assets
var assets = {};

//set static, dynamic helpers
_.extend(app.locals, {
    config: config,
    Loader: Loader,
    assets: assets
});

app.use('/', webRouter);

app.listen(config.port, function() {
    console.log('this is server started');
});