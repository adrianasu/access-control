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
    Department, Employer, Training
} = require('../app/employee/employee.model');
const {
    TEST_DATABASE_URL,
    HTTP_STATUS_CODES
} = require('../app/config');

const { seedEmployeesData } = require('./fakeData');

const {
    generateTestUser,
    generateToken
} = require('./fakeUser');

const expect = chai.expect;

// allow us to use chai.request() method
chai.use(chaiHttp);

let testUser, jwToken;
const departmentProperties = ["departmentName"];

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

function checkResponse(res, statusCode, resType) {
    expect(res).to.have.status(statusCode);
    expect(res).to.be.json;
    expect(res.body).to.be.a(resType);
}

function checkObjectContent(res, keyList) {
    keyList.forEach(function (key) {
        expect(res).to.include.keys(key);
      
    });
}

function checkArrayContent(res, keyList) {
    const department = res.body[0];
    expect(res.body).to.have.lengthOf.at.least(1);
    expect(department).to.be.a('object');
    keyList.forEach(function (key) {
        expect(department).to.include.keys(key);
    })
}

describe('Options API Resource Tests', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        testUser = generateTestUser();
        return generateToken(testUser)
            .then(function (_jwToken) {
                jwToken = _jwToken;
                return seedEmployeesData();
            })
    });

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });

    it('Should get all Departments, Employers and Trainings', function () {

        return chai.request(app)
            .get('/api/options')
            .set('Authorization', `Bearer ${jwToken}`)
            .then(function (res) {
              
                checkResponse(res, HTTP_STATUS_CODES.OK, 'object');
            })
            .catch(function(err) {
                console.log(err);
            });
    });

                     
})