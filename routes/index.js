var express = require('express');
var router = express.Router();
const passport = require('passport');
const User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', function(req, res, next) {
  res.render('user/registrar');
});

router.post('/register', async function(req, res, next){
  try{
    const user = await User.register(new User(req.body), req.body.password);
  req.login(user, function(err){
    if(err) return next(err);
    res.redirect('/');
  });
  }catch(err){
    const { username, email } = req.body;
		let error = err.message;
		if (error.includes('duplicate') && error.includes('index: email_1 dup key')) {
			error = 'A user with the given email is already registered';
		}
		res.render('register', { title: 'Register', username, email, error });
  }
});

router.get('/login', async (req, res, next)=>{
  if (req.isAuthenticated()) return res.redirect('/');
	if (req.query.returnTo) req.session.redirectTo = req.headers.referer;
	res.render('user/login', { title: 'Login' });
});

router.post('/login', async (req, res, next)=> {
  const { username, password } = req.body;
	const { user, error } = await User.authenticate()(username, password);
	if (!user && error) return next(error);
	req.login(user, function(err) {
		if (err) return next(err);
		req.session.success = `Welcome back, ${username}!`;
		const redirectUrl = req.session.redirectTo || '/';
		delete req.session.redirectTo;
		res.redirect(redirectUrl);
	});
});

router.get('/logout', (req, res, next) => {
	req.logout();
	  res.redirect('/');
  });

module.exports = router;
