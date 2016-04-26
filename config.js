var config = {};

config.port = 3000;
config.host = 'localhost';

// mongodb 配置
config.db = 'mongodb://127.0.0.1/bookj';

config.list_topic_count = 20;


config.auth_cookie_name = 'node_clubak';

config.admins = { user_login_name: true };


module.exports = config;