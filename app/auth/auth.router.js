const express = require('express');
// jsonwebtoken to implement JSON Web Tokens
const jwt = require('jsonwebtoken');


const {
    localPassportMiddleware,
    jwtPassportMiddleware
} = require('../auth/auth.strategy');

const {
    JWT_SECRET,
    JWT_EXPIRY
} = require('../config.js');

const authRouter = express.Router();


// return JWT as string
function createJWToken(user) {
    return jwt.sign({
        user
    }, JWT_SECRET, {
        subject: user.username,
        expiresIn: JWT_EXPIRY,
        algorithm: 'HS256'
    });
}

// for username and password authentication
authRouter.post('/login', localPassportMiddleware, (req, res) => {
    const user = req.user.serialize();
    const jwToken = createJWToken(user);
    res.json({
        jwToken,
        user
    });
    
});

// for creating new JWT when the previous one is about to get expired
authRouter.post('/refresh', jwtPassportMiddleware, (req, res) => {
    const user = req.user;
    const jwToken = createJWToken(user);
    res.json({
        jwToken,
        user
    });
});

module.exports = {
    authRouter
};