
var express = require('express');

var dox = require('./controllers/dox');

var router = express.Router();

router.get('/',function(req,res,next){
	res.render('index',{});
});
router.post('/dox/create',dox.create);

module.exports = router;