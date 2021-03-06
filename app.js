var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var dbConnections = require('./DAO/DBConnection');
var session = require('express-session');
var mongoose = require ('mongoose');
var bodyParser = require('body-parser');
var LoadProfileManager = require('./Helpers/LoadProfileManager');

// ============== Routes ==============
var routes = require('./routes/index');
var admin = require('./routes/admin');
var manualSwitch = require('./routes/manualSwitch');
var webAdmin = require('./routes/webAdmin');
// ============== Routes Ends==============

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/node_modules')));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//SESSION SETUP
app.use(session(
    {   
      secret: 'projectManagementAgileWay',
      saveUninitialized: true,
      resave: true
    }
));

app.use('/', routes);
app.use('/admin', admin);
app.use('/manualSwitch', manualSwitch);
app.use('/webAdmin', webAdmin);

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

module.exports = app;