const mongoose = require('mongoose');
const Joi = require('joi');  // allows to create schemas for JS objects to ensure validation of data
const bcrypt = require('bcryptjs'); // password hashing function that incorporates salt

// mongoose schema to define the structure of our 'user' documents within a collection
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// mongoose serialize method to define the structure of the 'user' data we're sending in the reponse body
userSchema.methods.serialize = function () {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        username: this.username,
    };
};

// method to hash a password before storing it
userSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 10);
};

// validate a password by hashing and comparing it to the one stored
userSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

// use Joi to determine that some data is valid to create a new user
const UserJoiSchema = Joi.object().keys({
    name: Joi.string().min(1).trim().required(),
    username: Joi.string().alphanum().min(4).max(30).trim().required(),
    password: Joi.string().min(7).max(30).trim().required(),
    email: Joi.string().email().trim().required()
});

const User = mongoose.model('user', userSchema);

module.exports = { User, UserJoiSchema };