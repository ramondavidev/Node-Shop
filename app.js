const createError = require('http-errors');
const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo')(session);
const paypal = require('paypal-rest-sdk');

const indexRouter = require('./routes/index');
const lojaRouter = require('./routes/loja');

const app = express();

const User = require('./models/user');

mongoose.connect('mongodb://localhost:27017/electroshop', {
useUnifiedTopology: true,
useNewUrlParser: true,
useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Banco de dados conectado!');
});


app.engine('ejs', engine);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));


//Configure Passport and Sessions
app.use(session({
  secret: 'hang ten dude!',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000} //180 is equal to 3 hours
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AdZZ5MbDVacq3FHDNUcAJj55mxig-QU5OI14HZ43tou9svceE_8WSYOiw-fRsIIvqv8bbklFfthKAz_6',
  'client_secret': 'EKYHbrtxYqoxLqqsdcytvl_kQNxB6ktC586cZgv4QU27KChxWoyRXf76fxUdikVldTqUyfaYUNVdEKAp'
});

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.session = req.session;
  next();
});


app.use('/', indexRouter);
app.use('/loja', lojaRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
