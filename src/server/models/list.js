const mongoose = require('mongoose');

const listSchema = mongoose.Schema({
    username: String,
    name: String
});

module.exports = mongoose.model('List', listSchema);
