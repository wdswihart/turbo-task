const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    listID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    isComplete: Boolean,
    goalDate: Date,
    isArchived: Boolean
});

module.exports = mongoose.model('Task', taskSchema);
