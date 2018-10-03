const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {
    app,
    runServer,
    closeServer
} = require('../app/server');
const {
    Employee
} = require('../app/employee/employee.model');
const {
    TEST_DATABASE_URL,
    HTTP_STATUS_CODES
} = require('../app/config');
const { User } = require('../app/user/user.model');

const {
    seedEmployeesData,
    generateOneEmployee,
    generateFieldsToUpdate
} = require('./fakeData');
const {
    generateTestUser,
    generateToken
} = require('./fakeUser');

const expect = chai.expect;

// allow us to use chai.request() method
chai.use(chaiHttp);

let testUser, jwToken;
const userKeys = ['id', 'name', 'username', 'email', 'accessLevel'];
const newUserKeys = ['name', 'email', 'username'];


function checkResponse(res, statusCode, resType) {
    expect(res).to.have.status(statusCode);
    expect(res).to.be.json;
    expect(res.body).to.be.a(resType);
}

function checkObjectContent(res, userKeys, newUser) {
    expect(res.body).to.include.keys(userKeys);
    userKeys.forEach(function(key) {
        expect(res.body[key]).to.equal(newUser[key]);
    })
}

function checkArrayContent(res, userKeys) {
    expect(res.body).to.have.lengthOf.at.least(1);
    expect(res.body[0]).to.include.keys(userKeys);
    expect(res.body[0]).to.not.include.keys('password');
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}


describe('Users API resource edge cases tests', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        // set access level high enough to GET one user or UPDATE name and 
        // email but low enough to fail when trying to UPDATE accessLevel,
        // DELETE an user or GET all users.
        let accessLevel = User.ACCESS_PUBLIC;
        testUser = generateTestUser(accessLevel);
        return generateToken(testUser)
            .then(function (_jwToken) {
                jwToken = _jwToken;
            })
    });

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });

    it('Should not return all users', function () {
        return chai.request(app)
            .get('/api/user')
            .set("Authorization", `Bearer ${jwToken}`)
            .then(function (res) {
            expect(res).to.have.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);                
            });
    });

    it('Should return a user by id', function () {
        let foundUser;
        return User
            .findOne()
            .then(function(_foundUser) {
                foundUser = _foundUser;    
                return chai.request(app)
                    .get(`/api/user/${foundUser.id}`)
                    .set("Authorization", `Bearer ${jwToken}`)
            })
            .then(function (res) {
                checkResponse(res, HTTP_STATUS_CODES.OK, 'object');
                expect(res.body.id).to.equal(foundUser.id);
            });
    });

    
    it(`Should not update a user bc accessLevel to update is higher than the users's`, function () {

        let updateUser = {
            name: "New Name",
            email: "new@email.com",
            accessLevel: 100
        }

        return User
            .findOne()
            .then(function (foundUser) {
                    updateUser.id = foundUser.id;

                return chai.request(app)
                    .put(`/api/user/${updateUser.id}`)
                    .set("Authorization", `Bearer ${jwToken}`)
                    .send(updateUser)
            })
            .then(function (res) {
                checkResponse(res, HTTP_STATUS_CODES.UNAUTHORIZED, 'object');
            })
            .catch(function (err) {
                console.log(err);
            });
    });

    it('Should not delete user by id', function () {
 
        return User
            .findOne()
            .then(function (foundUser) {
        
                return chai.request(app)
                    .delete(`/api/user/${foundUser.id}`)
                    .set("Authorization", `Bearer ${jwToken}`)
            })
            .then(function (res) {
                expect(res).to.have.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
            })
            .catch(function (err) {
                console.log(err);
            });
    });

   
});
 
 
