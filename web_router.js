var express = require('express');

var topic = require('./controllers/topic');
var site = require('./controllers/site');

var router = express.Router();

router.get('/', site.index);

router.get('/t/create', topic.create);
router.get('/t/:tid', topic.index);

router.post('/t/create', topic.put);

module.exports = router;