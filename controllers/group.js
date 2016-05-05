var groupManager = require('../managers/group');

exports.put = function(req, res, next){

	var name = req.body.name;
	var email = req.body.email;
	var creator = req.session.user;

	

};