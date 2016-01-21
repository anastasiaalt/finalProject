var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
  content: String
});

mongoose.model('posts', postsSchema);
