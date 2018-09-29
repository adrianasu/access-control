const faker = require('faker');
const jsonwebtoken = require('jsonwebtoken');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { JWT_SECRET, JWT_EXPIRY } = require('../app/config');

const { User } = require('../app/user/user.model');

const accessLevel = 10;

function generateTestUser() {
    return {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        accessLevel: accessLevel
    };
}

function seedTestUser(testUser, hashedPassword) {
    return User
        .create({
            name: testUser.name,
            email: testUser.email,
            username: testUser.username,
            password: hashedPassword
            //accessLevel: getFromArray
        })
}

function generateJwToken(user) {
    return jsonwebtoken.sign(
        {
            user: {
                id: user.id,
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
    return User.hashPassword(testUser.password)
        .then(hashedPassword => {
            return seedTestUser(testUser, hashedPassword)
        })
        .then(createdUser => {
            testUser.id = createdUser.id;
            return generateJwToken(testUser)
        })
        .catch(err => {
            console.error(err);
        })
}

module.exports = { generateTestUser, generateToken };