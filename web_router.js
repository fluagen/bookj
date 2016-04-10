var express = require('express');

var article = require('./controllers/article');

var router = express.Router();

router.get('/', article.index);

router.get('/a/create', article.create);
router.post('/a/create', article.put);

module.exports = router;