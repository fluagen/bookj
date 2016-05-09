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

  topic_count: { type: Number, default: 0 },
  reply_count: { type: Number, default: 0 },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },

  active: {type: Boolean, default: true}
});

UserSchema.plugin(BaseModel);

mongoose.model('User', UserSchema);
