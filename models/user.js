var mongoose  = require('mongoose');
var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;
var utility   = require('utility');

var UserSchema = new Schema({
  loginname: { type: String},
  pass: { type: String },
  email: { type: String},
  pagehome: { type: String },
  avatar: { type: String },
  is_block: {type: Boolean, default: false},

  topic_count: { type: Number, default: 0 },
  reply_count: { type: Number, default: 0 },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  active: { type: Boolean, default: false },

  retrieve_time: {type: Number},
  retrieve_key: {type: String},

  accessToken: {type: String},
});

UserSchema.plugin(BaseModel);


UserSchema.index({loginname: 1}, {unique: true});
UserSchema.index({email: 1}, {unique: true});
UserSchema.index({accessToken: 1});

mongoose.model('User', UserSchema);
