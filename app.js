var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');

// fucking remove this
var temp_title = "Grade Tracker verson 0.01";

var configDb = require('./config/database.js');
// configuration - connecting to database
mongoose.connect(configDb.url);
// pass passport for configuration
require('./config/passport')(passport);
users = require('./routes/users.js');
var index = require('./routes/index.js');
var app = express();

// require for passport
app.use(session({
  secret: 'appsecret1104',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes configuration
//app.use('/', index);
app.use('/u', authenticate, users);

// home page
app.get('/', function(req, res){
  res.render('index', {
    title: temp_title
  }); 
});

// login and register pages 
app.get('/register', isLoggedIn, function(req, res){
  res.render('register', {
    title: temp_title
  });
});

app.get('/login', isLoggedIn, function(req, res){
  res.render('login', {
    title: temp_title
  });
});

// register 
app.post('/register', passport.authenticate('local-signup',{
  successRedirect: '/u',
  failureRedirect: '/register',
  failureFlash: true
}));

// login
app.post('/login' ,passport.authenticate('local-signin', {
  successRedirect: '/u',
  failureRedirect: '/login',
  failureFlash: true
}));

// check if user is logged in for register/login pages
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    res.redirect('/u');
  }else{
    return next();
  }
}

// authenticate angular app
function authenticate(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect('/');
}

// logout
app.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('/');
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(process.env.PORT || 1317, function(){
  console.log("listening on port 1317");
});


module.exports = app;
