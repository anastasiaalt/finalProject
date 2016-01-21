var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var fs = require('fs');

// Configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));
app.set('view engine', 'ejs')
mongoose.connect('mongodb://localhost/test')

fs.readdirSync(__dirname + '/models').forEach(function(filename){
  if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
});

// db
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var mongoUrl = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/sandbox';
MongoClient.connect(mongoUrl, function(err, database) {
  if (err) { throw err; }
  db = database;
  process.on('exit', db.close);
});

//Mongoose
mongoose.model('problems', {content: String});

// var problemSchema = mongoose.Schema({
//     name: String
// });
// var Problem = mongoose.model('Problem', problemSchema);
// var stress = new Problem({ content: 'Very anxious' });
// console.log(stress.name); // 'Very anxious'




// Routes
app.get('/', function(req, res){
  res.render('index');
});

app.get('/problems', function(req, res){
  mongoose.model('problems').find(function(err, problems) {
    res.send(problems);
  });
});


app.listen(process.env.PORT || 3000);

console.log('Connected');
