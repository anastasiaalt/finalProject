var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postsSchema = new Schema({
  content: String
});

mongoose.model('posts', postsSchema);

mongoose.model('posts', {content: String});

app.get('/posts', function(req, res){
  mongoose.model('posts').find(function(err, posts) {
    res.send(posts);
  });
});