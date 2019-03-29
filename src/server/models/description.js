const mongoose = require('mongoose');

const descriptionSchema = mongoose.Schema({
    taskID: mongoose.Schema.Types.ObjectId,
    content: String
});

module.exports = mongoose.model('Description', descriptionSchema);
