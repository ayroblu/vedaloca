//require('./minify');
require('console-stamp')(console, {
  colors: {
    stamp: "white",
    label: "yellow",
	}
});
//require('./minify');

// Main imports
var express = require('express');
var compression = require('compression');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var multer = require('multer'); // v1.0.5 // Used for multipart/form-data file uploading
var stylus = require('stylus');
var autoprefixer = require('autoprefixer-stylus');
var df = require('dateformat');

// routing imports
var routes = require('./routes/index');
var api = require('./routes/api');

// Running a server
var app = express();
var http = require('http').Server(app);
var io = require('./lib/sockets').listen(http)

//app.use(function(req, res, next) {
//    // Set permissive CORS header - this allows this server to be used only as
//    // an API server in conjunction with something like webpack-dev-server.
//    res.setHeader('Access-Control-Allow-Origin', '*');
//    next();
//});


// Trying mssql
//var connection = require('./lib/sqlserver');

// Trying edge
//var edge = require('./lib/edgedll')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
logger.format('mydate', function(req, res) {
  return df(new Date()).toString().cyan;
});
logger.format('mystatus', function(req, res) {
  if (res.statusCode >= 400)
    return res.statusCode.toString().red;
  else if (res.statusCode >= 300)
    return res.statusCode.toString().yellow;
  return res.statusCode.toString().green;
});
//app.use(logger('[:mydate] :method :url :status :res[content-length] - :remote-addr - :response-time ms'));
app.use(logger('[:mydate] :remote-addr - :remote-user ":method :url HTTP/:http-version" :mystatus :res[content-length] ":referrer" ":user-agent"'));
//app.use(logger('combined'));

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//var upload = multer(); // for parsing multipart/form-data
app.use(cookieParser());
app.use(stylus.middleware({
  src: path.join(__dirname, 'public'),
  compile: function(str, path) {
    return stylus(str)
      .use(autoprefixer())   // autoprefixer
      .set('filename', path) // @import
      .set('compress', true) // compress
      .set('include css', true)
    ;
  }
}));
 
app.use(compression());

app.use(express.static(path.join(__dirname, 'public')));

//console.log(stylus.middleware({
//  src: path.join(__dirname, 'public'),
//  compile: function(str, path) {
//    return stylus(str)
//      .use(autoprefixer())   // autoprefixer
//      .set('filename', path) // @import
//      .set('compress', true) // compress
//    ;
//  }
//})+"");

app.use('/', routes);
app.use('/api', api);

io.on('connection', function(socket){
  console.log('a user connected');
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


//module.exports = app;
module.exports = http;
