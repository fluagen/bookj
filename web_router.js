var express = require('express');
var topic = require('./controllers/topic');
var reply = require('./controllers/reply');
var site = require('./controllers/site');
var sign = require('./controllers/sign');
var group = require('./controllers/group');


var auth = require('./middlewares/auth');

var router = express.Router();

router.get('/', site.index);

router.get('/topic/create', auth.userRequired, topic.create);
router.get('/topic/:tid', topic.index);
router.post('/topic/create', auth.userRequired, topic.put);
router.post('/:tid/reply', auth.userRequired, reply.add);

router.get('/group/:gid', group.index);
router.get('/group/create', group.create);
router.post('/group/create', group.put);

router.get('/signup', sign.showSignup);
router.post('/signup', sign.signup);
router.get('/signin', sign.showLogin);
router.post('/signin', sign.login);

module.exports = router;