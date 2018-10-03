const express = require('express');
const Joi = require('joi');

const { HTTP_STATUS_CODES } = require('../config');
const { jwtPassportMiddleware } = require('../auth/auth.strategy');
//const { canChangeAccessLevel } = require('./user.model');
const User = require('./user.model');
const Users = User.User;

const userRouter = express.Router();






// create new user
userRouter.post('/', (req, res) => {
    
    const newUser = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        accessLevel: User.ACCESS_OVERVIEW_ONLY
    };

    // validate new user data with Joi
    const validation = Joi.validate(newUser, User.UserJoiSchema);
    if (validation.error) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
            error: validation.error
        });
    }
    // verify if username or email exists already in our DB.
    // use findOne mongoose function to try to retrieve an existent 'user'
    Users
        .findOne({
            // $or operator performs a logical OR operation on an array of two 
            // or more <expressions> and selects the documents that satisfy at 
            // least one of the <expressions>
            $or: [{
                    email: newUser.email
                },
                {
                    username: newUser.username
                }
            ]
        })
        .then(user => {
            if (user) {
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST)
                    .json({
                        error: 'A user with that username and/or email already exists'
                    });
            }
            // username/email non existent so hash password
            return Users.hashPassword(newUser.password);
        })
        .then(passwordHash => {
            newUser.password = passwordHash;
            // attemp to create new user
            Users
                .create(newUser)
                .then(createdUser => {
                    // success
                    return res.status(HTTP_STATUS_CODES.CREATED).json(createdUser.serialize());
                })
                .catch(error => {
                    return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
                });
        })
        .catch(error => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});


// retrieve all users using mongoose function find
userRouter.get('/', jwtPassportMiddleware, 
    User.hasAccess(User.ACCESS_ADMIN), 
    (req, res) => {
    Users
        .find()
        .then(_users => {
            return res.status(HTTP_STATUS_CODES.OK).json(_users.map(_user => _user.serialize()));
        })
        .catch(error => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

// get one 'user' using mongoose function findById
userRouter.get('/:userId', jwtPassportMiddleware, 
    User.hasAccess(User.ACCESS_PUBLIC),
    (req, res) => {
    Users
        .findById(req.params.userId)
        .then(user => {
            return res.status(HTTP_STATUS_CODES.OK).json(user.serialize());
        })
        .catch(error => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

// update user's name, email or accessLevel by id
userRouter.put('/:userId', jwtPassportMiddleware,
    User.hasAccess(User.ACCESS_PUBLIC), 
    (req, res) => {
    // check that id in request body matches id in request path
    if (req.params.userId !== req.body.id) {
        const message = `Request path id ${req.params.userId} and request body id ${req.body.id} must match`;
        console.log(message);
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
            message: message
        });
    }

    // we only support a subset of fields being updateable.
    // If the user sent over any of them 
    // we update those values on the database
    const updateableFields = ["name", "email", "accessLevel"];
    // check what fields were sent in the request body to update
    const toUpdate = {};
    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });
    // if request body doesn't contain any updateable field send error message
    if (toUpdate.length === 0) {
        const message = `Missing \`${updateableFields.join('or ')}\` in request body`;
        console.log(message);
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
            message: message
        });
    }
    
//check if accessLevel is actually going to change
    if ("accessLevel" in toUpdate &&
        req.user.accessLevel < req.body.accessLevel ) {
        
        const message = `Unauthorized access level`;
        console.log(message);
        return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
            message: message
        });
    }
 
    const validation = Joi.validate(toUpdate, User.UpdateUserJoiSchema);
    
    if (validation.error) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
            error: validation.error
        });
    }


    Users
        // $set operator replaces the value of a field with the specified value
        .findByIdAndUpdate(req.params.userId, {
            $set: toUpdate
        }, {
            new: true
        })
        .then(updatedUser => {
            console.log(`Updating user with id: \`${req.params.userId}\``);
            return res.status(HTTP_STATUS_CODES.OK).json(updatedUser.serialize());
        })
        .catch(err => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
        });
});


// delete one 'user' using mongoose function findByIdAndDelete
userRouter.delete('/:userId', jwtPassportMiddleware, 
    User.hasAccess(User.ACCESS_ADMIN), 
    (req, res) => {
    Users
    .findByIdAndDelete(req.params.userId)
        .then(deletedUser => {
            console.log(`Deleting user with id: \`${req.params.userId}\``);
            res.status(HTTP_STATUS_CODES.OK).json({
                deleted: `${req.params.userId}`,
                OK: "true"
            });
        })
        .catch(err => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).res(err);
        });
});

module.exports = { userRouter };