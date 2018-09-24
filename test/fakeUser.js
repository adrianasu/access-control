const faker = require('faker');
const jsonwebtoken = require('jsonwebtoken');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { JWT_SECRET, JWT_EXPIRY } = require('../app/config');

const {
    Users
} = require('../app/user/user.model');

function generateTestUser() {
    return {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email()
    };
}

function seedTestUser(testUser, hashedPassword) {
    return Users
        .create({
            name: testUser.name,
            email: testUser.email,
            username: testUser.username,
            password: hashedPassword
        })
}

function generateJwToken(user) {
    jwToken = jsonwebtoken.sign(
        {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username
            }
        },
        JWT_SECRET,
        {
            algorithm: 'HS256',
            expiresIn: JWT_EXPIRY,
            subject: user.username
        }
    );
}

function generateToken(testUser) {
    return Users.hashPassword(testUser.password)
        .then(hashedPassword => {
            return seedTestUser(testUser, hashedPassword)
        })
        .catch(err => {
            console.error(err);
        })
        .then(createdUser => {
            testUser.id = createdUser.id;
            return generateJwToken(testUser)
        })
}

module.exports = { generateTestUser, generateToken };