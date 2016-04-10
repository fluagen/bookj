var mongoose  = require('mongoose');
var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var ArticleSchema = new Schema({
  title: { type: String },
  descripion: {type: String},
  content: { type: String },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  public: {type: Boolean, default: true},
  deleted: {type: Boolean, default: false},
});

ArticleSchema.plugin(BaseModel);
ArticleSchema.index({create_at: -1});

mongoose.model('Article', ArticleSchema);
