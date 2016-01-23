// Requirements
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Post = require('./models/post');
var User = require('./models/user');
var session = require('express-session');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var passport = require('passport');
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
mongoose.connect('mongodb://localhost/sandbox');

var app = express();

// To Do: Don't push these to github, move them to environment bash profile and access via process.env
var clientId = '778jnepkcnh6i3';
var clientSecret = 'IHh7ZOSu1DWLtGlH';
var callbackUrl = 'http://127.0.0.1:3000/auth/linkedin/callback';

passport.use(new LinkedInStrategy({
    clientID: clientId,
    clientSecret: clientSecret,
    callbackURL: callbackUrl,
    scope: ['r_basicprofile'],
    state: true
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(accessToken, refreshToken, profile, done)
    process.nextTick(function(){
      return done(null, profile)
    });
    // User.findOrCreate({ linkedinId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
  }
));


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
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.get('/', function(req, res){
  Post.find({}, function(err, posts){
    res.render('index', {posts: posts});
  });
});

app.post('/posts', function(req, res){
 // TODO set the post's posted by to whoever is logged in's name
  var post = new Post(req.body.post);
  post.save(function(err, result){
    console.log(req.body);
    res.redirect('/');
  });
});


app.get('/posts/new', function(req, res){
  res.render('form');
});





// LinkedIn
app.get('/auth/linkedin', passport.authenticate('linkedin'));

app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
  successRedirect: '/',
  failureRedirect: '/login'
}));



app.listen(process.env.PORT || '3000');
console.log('Connected');