var mongoose  = require('mongoose');
var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var TopicSchema = new Schema({
	author_id: { type: ObjectId },
	loginname: { type: String },
	title: { type: String },
	content: { type: String },
	top: { type: Boolean, default: false }, // 置顶帖
	good: {type: Boolean, default: false}, // 精华帖
	lock: {type: Boolean, default: false}, // 被锁定主题
	reply_count: { type: Number, default: 0 },
	visit_count: { type: Number, default: 0 },
	collect_count: { type: Number, default: 0 },
	create_at: { type: Date, default: Date.now },
	update_at: { type: Date, default: Date.now },
	last_reply: { type: ObjectId },
	last_reply_at: { type: Date, default: Date.now },
	deleted: {type: Boolean, default: false}
});

TopicSchema.plugin(BaseModel);
TopicSchema.index({create_at: -1});

mongoose.model('Topic', TopicSchema);
