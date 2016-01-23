var mongoose = require('mongoose');
// TODO should this be associted with someone? or totes anonymous?
var postSchema = mongoose.Schema({
    content: String,
    topic: String,
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Post', postSchema);