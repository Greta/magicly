var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

var index = require('./routes/index');
var users = require('./routes/users');
var decks = require('./routes/decks');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// SETUP API
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/magicly');

var db = mongoose.connection;
db.on('error', console.error.bind(console, '# MongoDB - connection error: '));

// SETUP SESSIONS
app.use(session({
  secret: 'mySecretString',
  saveUninitialize: false,
  resave: false,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 2},
  store: new MongoStore({mongooseConnection: db, ttl: 2 * 24 * 60 * 60})
  //ttl: 2 days * 24 hours * 60 minutes * 60 seconds
}))

// save session
app.post('/draft', function(req, res){
  var draft = req.body;
  req.session.draft = draft;
  req.session.save(function(err){
    if (err){
      throw err;
    }
    res.json(req.session.draft);
  })
});

// get session
app.get('/draft', function(req, res){
  if (typeof req.session.draft !== 'undefined') {
    res.json(req.session.draft);
  }
});

// decks api
var Decks = require('./models/decks.js');

app.get('/decks', function(req, res){
  Decks.find(function(err, decks){
    if (err) {
      throw err;
    }
    res.json(decks);
  })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
