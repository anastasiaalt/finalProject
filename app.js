// Requirements
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/sandbox');

var app = express();

var Post = require('./models/post');
var User = require('./models/user');

var session = require('express-session');
var bcrypt = require('bcrypt');

var queryString = require('query-string');

// To Do: Don't push these to github, move them to environment bash profile and access via process.env
var clientSecret = process.env.LinkedInClientSecret;
var clientID = process.env.LinkedInClientId;
var callbackUrl = 'http://127.0.0.1:3000/auth/linkedin/callback';
var request = require('request');



// Middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'phil'
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'semantic')));

// Routes
app.get('/', function(req, res){
  Post.find({}, function(err, posts){
    res.render('index', {posts: posts});
  });
});

app.get('/posts/new', function(req, res){
  res.render('form');
})

app.post('/posts', function(req, res){
 // TODO set the post's posted by to whoever is logged in's name
  var post = new Post(req.body.post);
  post.save(function(err, result){
    console.log(req.body);
    res.redirect('/');
  });
});

app.get('/register', function(req, res){
  console.log(req.body);
  res.render('register');
});

app.post('/register', function(req, res){
  var user = new User(req.body.user);

  user.save(function(err, result) {
    console.log(req.body);
    res.redirect('/');
  });
});

app.post('/login', function(req, res){
  var user = new User(req.body.user);

    User.findOne({ username: user.username }, function(err, user) {
      if (err) throw err;
  
      user.comparePassword(user.password, function(err, isMatch) {
          if (err) throw err;
          res.redirect('/');
      });
      console.log(user.password);
    });
  
  console.log('no error');
});

app.get('/favorites', function(req, res){
  res.render('favorite');
});

app.get('/topics', function(req, res){
  res.render('topic');
})


app.get('/login/linkedin', function(req, res){
  var params = {
    response_type: 'code',
    client_id: clientID,
    redirect_uri: callbackUrl,
    state: 'Donna',
    scope: 'r_basicprofile'
  }
  var url = 'https://www.linkedin.com/uas/oauth2/authorization';
  paramsString = queryString.stringify(params);
  url = url + '?'+ paramsString;
  res.redirect(url);
});

app.get('/auth/linkedin/callback', function(req, res){
  // I know the query parameters in the URL but don't know how to render them in the path
  console.log(req.query.code);
  console.log('Above is Access Code');
  var params = {
    grant_type: 'authorization_code',
    code: req.query.code,
    redirect_uri: callbackUrl,
    client_id: clientID,
    client_secret: clientSecret
  };
  var url = 'https://www.linkedin.com/uas/oauth2/accessToken';
  // request is allowing you to make a post from within this get
  request.post(url, {form: params}, function(err, res, body){
    var accessToken = JSON.parse(body).access_token;
    // What should come back at the response is the access token
    req.session.accessToken = accessToken;
    console.log(req.session.accessToken);
    console.log('Above is Access Token');

    console.log(req.session);
    console.log('Above is Req.Session');
    console.log(session);
    console.log('Above is Session');
    // store access token in session
    // use access token to make request to LinkedIn for basic profile information
    // res.redirect('/');

    var options = {
      connection: 'Keep-Alive',
      authorization: 'Bearer'+accessToken,
    };
      console.log('Bearer'+accessToken);
      console.log(options);
    var finalURL = 'https://api.linkedin.com/v1/people/~';
    request.get(finalURL, {form: options}, function(err, res, body){
      var profile = JSON.parse(body).authorization;
      console.log(profile);
      var user = profile;
      console.log(user);
      user.save(function(err, result) {
        console.log(req.body);
      res.redirect('/');
      });
    });
  });
});



app.listen(process.env.PORT || '3000');
console.log('Connected');