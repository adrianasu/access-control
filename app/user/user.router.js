const express = require('express');
const Joi = require('joi');

const { HTTP_STATUS_CODES } = require('../config');
const { User, UserJoiSchema } = require('./user.model');

const userRouter = express.Router();

// create new user
userRouter.post('/', (req, res) => {
    const newUser = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    };

    // validate new user data with Joi
    const validation = Joi.validate(newUser, UserJoiSchema);
    if (validation.error) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }
    // verify if username or email exists already in our DB.
    // use findOne mongoose function to try to retrieve an existent 'user'
    User
        .findOne({
            // $or operator performs a logical OR operation on an array of two 
            // or more <expressions> and selects the documents that satisfy at 
            // least one of the <expressions>
            $or: [
                { email: newUser.email },
                { username: newUser.username }
            ]
        })
        .then(user => {
            if (user) {
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST)
                    .json({ error: 'A user with that username and/or email already exists'});
            }
            // username/email non existent so hash password
            return User.hashPassword(newUser.password);
        })
        .then(passwordHash => {
            newUser.password = passwordHash;
            // attemp to create new user
            User
                .create(newUser)
                .then(createdUser => {
                    // success
                    return res.status(HTTP_STATUS_CODES.CREATED).json(createdUser.serialize());
                })
                .catch(error => {
                    return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
                });
        });
});

// retrieve all users using mongoose function find
userRouter.get('/', (req, res) => {
    User
        .find()
        .then(users => {
            return res.status(HTTP_STATUS_CODES.OK).json(users.map(user => user.serialize()));
        })
        .catch(error => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

// retrieve one 'user' using mongoose function findById
userRouter.get('/:userid', (req, res) => {
    User
        .findById(req.params.userid)
        .then(user => {
            return res.status(HTTP_STATUS_CODES.OK).json(user.serialize());
        })
        .catch(error => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

module.exports = { userRouter };