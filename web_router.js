var express = require('express');

var topic = require('./controllers/topic');
var reply = require('./controllers/reply');
var site = require('./controllers/site');
var sign = require('./controllers/sign');

var router = express.Router();

router.get('/', site.index);

router.get('/topic/create', topic.create);
router.get('/topic/:tid', topic.index);
router.post('/topic/create', topic.put);
router.post('/:topic_id/reply', reply.add);

router.get('/signup', sign.showSignup);
router.post('/signup', sign.signup);
router.get('/signin', sign.showLogin);
router.post('/signin', sign.login);

module.exports = router;