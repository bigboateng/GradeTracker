var router = require('express').Router();

router.get('/', function(req, res){
	res.render('index', {title: "Grade Tracker verson 0.01"});
});	

router.get('/register', function(req, res){
	res.render('register', {title: "Grade Tracker verson 0.01"});
});


router.get('/login', function(req, res){
	res.render('login', {title: "Grade Tracker verson 0.01"});
});

module.exports = router;