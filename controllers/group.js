var groupManager = require('../managers/group');

exports.index = function(req, res, next) {
    var group_id = req.params.gid;
    var ep = new EventProxy();
    ep.on('group', function(group) {
        if (!group) {
           return res.render404('此小组不存在或已删除');
        }
        res.render('group/index', {
            group: group
        });
    });
    ep.fail(next);
    groupManager.getGroupById(group_id, ep.done('group'));
};

exports.create = function(req, res, next) {
	res.redirect('/group/create');
};

exports.put = function(req, res, next) {

    var name = req.body.name;
    var email = req.body.email;
    var description = req.body.description;
    var creator = req.session.user;

    var ep = new EventProxy();
    ep.on('group', function(group) {
        res.redirect('/group/' + group._id);
    });
    ep.fail(next);

    groupManager.newAndSave(name, email, description, creator, ep.done('group'));

};