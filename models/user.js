var mongoose  = require('mongoose');
var BaseModel = require("./base_model");
var renderHelper = require('../common/render_helper');
var Schema    = mongoose.Schema;
var utility   = require('utility');
var _ = require('lodash');

var UserSchema = new Schema({
  loginname: { type: String},
  pass: { type: String },
  email: { type: String},
  url: { type: String },
  avatar: { type: String },
  is_block: {type: Boolean, default: false},

  score: { type: Number, default: 0 },
  topic_count: { type: Number, default: 0 },
  reply_count: { type: Number, default: 0 },
  collect_tag_count: { type: Number, default: 0 },
  collect_topic_count: { type: Number, default: 0 },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  active: { type: Boolean, default: false },

  receive_reply_mail: {type: Boolean, default: false },
  receive_at_mail: { type: Boolean, default: false },

  retrieve_time: {type: Number},
  retrieve_key: {type: String},

  accessToken: {type: String},
});

UserSchema.plugin(BaseModel);
UserSchema.virtual('avatar_url').get(function () {
  var url = this.avatar || ('https://gravatar.com/avatar/' + utility.md5(this.email.toLowerCase()) + '?size=48');

  // www.gravatar.com 被墙
  url = url.replace('www.gravatar.com', 'gravatar.com');

  // 让协议自适应 protocol，使用 `//` 开头
  if (url.indexOf('http:') === 0) {
    url = url.slice(5);
  }

  // 如果是 github 的头像，则限制大小
  if (url.indexOf('githubusercontent') !== -1) {
    url += '&s=120';
  }

  return url;
});


UserSchema.index({loginname: 1}, {unique: true});
UserSchema.index({email: 1}, {unique: true});
UserSchema.index({score: -1});
UserSchema.index({accessToken: 1});

mongoose.model('User', UserSchema);
