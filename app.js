var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Post = require('./models/post');
var User = require('./models/user');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'semantic')));

app.get('/', function(req, res){
  Post.find({}, function(err, posts){
    res.render('index', {posts: posts});
  });
});

app.post('/posts', function(req, res){
  var post = new Post(req.body.post);
  post.save(function(err, result){
    console.log(req.body);
    res.redirect('/');
  });
});

app.listen(process.env.PORT || '3000');

console.log('Connected');