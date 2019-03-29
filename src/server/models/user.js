const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hash: String,
    salt: String,
    mostRecentListID: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

const iterations = 1000;
const keyLength = 64;

userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto
            .pbkdf2Sync(password, this.salt, iterations, keyLength, 'sha512')
            .toString('hex');
};

userSchema.methods.validatePassword = function(password) {
    const hash = crypto
            .pbkdf2Sync(password, this.salt, iterations, keyLength, 'sha512')
            .toString('hex');
    return this.hash === hash;
};

userSchema.methods.generateJWT = function() {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        username: this.username,
        expiryDate: parseInt(expiryDate.getTime() / 1000),
        mostRecentListID: this.mostRecentListID
    }, process.env.JWT_SECRET);
};

module.exports = mongoose.model('User', userSchema);
