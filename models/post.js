var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/sandbox');

var postSchema = mongoose.Schema({
    content: String,
    channel: String
});

module.exports = mongoose.model('Post', postSchema);