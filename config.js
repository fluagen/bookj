var config = {};

config.port = 3000;
config.host = 'localhost';

// mongodb 配置
config.db = 'mongodb://127.0.0.1/bookj';

config.list_topic_count = 20;


config.auth_cookie_name = 'node_clubak';

config.admins = { user_login_name: true };

  // redis 配置，默认是本地
  config.redis_host = '127.0.0.1';
  config.redis_port = 6379;
  config.redis_db = 0;


module.exports = config;