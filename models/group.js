var mongoose  = require('mongoose');
var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var GroupSchema = new Schema({
  name: { type: String},
  email: { type: String},
  pagehome: { type: String },
  avatar: { type: String },
  is_block: {type: Boolean, default: false},
  topic_count: { type: Number, default: 0 },
  blog_count: { type: Number, default: 0 },
  creator_id: { type: ObjectId },
  admin: [Schema.Types.ObjectId],
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now }
});

GroupSchema.plugin(BaseModel);

mongoose.model('Group', GroupSchema);