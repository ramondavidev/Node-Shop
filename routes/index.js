var express = require('express');
var router = express.Router();
const passport = require('passport');
const paypal = require('paypal-rest-sdk');
const Produto = require('../models/produto');
const Cart = require('../models/cart');
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

router.get('/add-to-cart/:id', function(req, res, next){
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart: {});

	Produto.findById(productId, function(err, product){
		if(err){
			return res.redirect('/');
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		console.log(req.session.cart);
		res.redirect('/loja');
	});
});

router.get('/shopping-cart', function(req, res, next){
	if(!req.session.cart){
		return res.render('produto/shopping-cart', {products: null})
	}
	var cart = new Cart(req.session.cart);
	var keys = Object.keys(cart.items);
	console.log(cart.items[keys[0]]);
	res.render('produto/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalpreco});
});

router.post('/pay', (req, res) => {

	const create_payment_json = {
	  "intent": "sale",
	  "payer": {
		  "payment_method": "paypal"
	  },
	  "redirect_urls": {
		  "return_url": "http://localhost:3000/success",
		  "cancel_url": "http://localhost:3000/cancel"
	  },
	  "transactions": [{
		  "item_list": {
			  "items": [{
				  "name": "Red Sox Hat",
				  "sku": "001",
				  "price": "25.00",
				  "currency": "BRL",
				  "quantity": 1
			  }]
		  },
		  "amount": {
			  "currency": "BRL",
			  "total": "25.00"
		  },
		  "description": "Hat for the best team ever"
	  }]
  };
  
  paypal.payment.create(create_payment_json, function (error, payment) {
	if (error) {
		throw error;
	} else {
		for(let i = 0;i < payment.links.length;i++){
		  if(payment.links[i].rel === 'approval_url'){
			res.redirect(payment.links[i].href);
		  }
		}
	}
  });
  
  });
  
  router.get('/success', (req, res) => {
	const payerId = req.query.PayerID;
	const paymentId = req.query.paymentId;
  
	const execute_payment_json = {
	  "payer_id": payerId,
	  "transactions": [{
		  "amount": {
			  "currency": "BRL",
			  "total": "25.00"
		  }
	  }]
	};
  
	paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
	  if (error) {
		  console.log(error.response);
		  throw error;
	  } else {
		  console.log(JSON.stringify(payment));
		  res.send('Success');
	  }
  });
  });
  
  router.get('/cancel', (req, res) => res.send('Cancelled'));

  /* for(var i = 0; i < keys.length; i ++){
	var obj =
		{
		"name": cart.items[keys[i]].name,
		"sku": "001",
		"price": cart.items[keys[i]].price,
		"currency": "BRL",
		"quantity": cart.items[keys[i]].qty
	}
	create_payment_json["transactions"]["item_list"]["items"].push(obj);
}

var cart = new Cart(req.session.cart);
var keys = Object.keys(cart.items);
*/



module.exports = router;
