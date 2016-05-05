var models = require('../models');
var Group = models.Group;

exports.add = function(name, email, creator, callback){
	
	var group = new Group();
	group.name = name;
	group.email = email;
	group.creator_id = creator._id;

	group.save(callback);

};