var models = require('../models');
var Group = models.Group;
var EventProxy = require('eventproxy');
var userManager = require('./user');

exports.getGroupsByQuery = function(query, opt, callback) {
    Group.find(query, '', opt, callback);
};

exports.getGroupById = function(id, callback) {
    var ep = new EventProxy();
    ep.on('group', function(group) {
        ep.all('creator', 'admin', function(creator, admin) {
            group.creator = creator;
            group.admin = admin;
            return callback(null, group);
        });
        userManager.getUserById(group.creator_id, ep.done('creator'));
        if (group.admin_ids) {
        	userManager.getUsersByIds(group.admin_ids, ep.done('admin'));
        } else {
            ep.emit('admin', []);
        }
    });
    ep.fail(callback);
    Group.findOne({
        _id: id
    }, ep.done('group'));
};

exports.newAndSave = function(name, email, description, creator, callback) {
    var group = new Group();
    group.name = name;
    group.email = email;
    group.description = description;
    group.creator_id = creator._id;

    group.save(callback);
};