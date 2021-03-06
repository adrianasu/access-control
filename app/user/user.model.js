const mongoose = require('mongoose');
const Joi = require('joi');  // allows to create schemas for JS objects to ensure validation of data
const bcrypt = require('bcryptjs'); // password hashing function that incorporates salt

const ACCESS_BASIC = 0;
const ACCESS_OVERVIEW = 10;
const ACCESS_PUBLIC = 20
const ACCESS_ADMIN = 30;

const levels = { ACCESS_BASIC, ACCESS_OVERVIEW, ACCESS_PUBLIC, ACCESS_ADMIN };

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
    },
    accessLevel: {
        type: Number,
        required: true,
        default: ACCESS_OVERVIEW,
    }
});

// mongoose serialize method to define the structure of the 'user' data we're sending in the reponse body
userSchema.methods.serialize = function () {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        username: this.username,
        accessLevel: this.accessLevel,
        levels
    };
};

userSchema.methods.serializeOverview = function () {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        accessLevel: this.accessLevel,
        levels
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

userSchema.statics.ACCESS_BASIC = ACCESS_BASIC;
userSchema.statics.ACCESS_OVERVIEW = ACCESS_OVERVIEW;
userSchema.statics.ACCESS_PUBLIC = ACCESS_PUBLIC;
userSchema.statics.ACCESS_ADMIN = ACCESS_ADMIN;


// check if user is allowed to access an endpoint
userSchema.statics.hasAccess = function (accessLevel) {
    // express expects a function with req, res, next as parameters
    return function (req, res, next) {
        console.log(`checking if ${req.user.username} is allowed`);
        if (req.user && req.user.accessLevel >= accessLevel) {
            next();
        } 
        else {
            const err = new Error("Access not allowed. To increase your access level contact an admin.");
            err.code = 403;
            next(err);
        }
    }
}

// use Joi to determine that some data is valid to create a new user
const UserJoiSchema = Joi.object().keys({
    name: Joi.string().min(1).trim().required(),
    username: Joi.string().min(4).max(30).trim().required(),
    password: Joi.string().min(7).max(30).trim().required(),
    email: Joi.string().email().trim().required(),
    accessLevel: Joi.number().optional()
});

const UpdateUserJoiSchema = Joi.object().keys({
    name: Joi.string().min(1).trim(),
    email: Joi.string().email().trim(),
    accessLevel: Joi.number()
});

const User = mongoose.model('user', userSchema);

module.exports = { User, 
    UserJoiSchema, 
    UpdateUserJoiSchema, 
    hasAccess: userSchema.statics.hasAccess,
    ACCESS_BASIC,
    ACCESS_OVERVIEW,
    ACCESS_PUBLIC,
    ACCESS_ADMIN
};