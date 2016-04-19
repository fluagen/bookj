var express = require('express');

var topic = require('./controllers/topic');
var reply = require('./controllers/reply');
var site = require('./controllers/site');
var user = require('./controllers/user');

var router = express.Router();

router.get('/', site.index);

router.get('/t/create', topic.create);
router.get('/t/:tid', topic.index);
router.post('/t/create', topic.put);
router.post('/:topic_id/reply', reply.add);

router.get('/signup', site.signup);
router.post('/register', user.add);

module.exports = router;