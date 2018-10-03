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
    Employer, Department
} = require('../app/employee/employee.model');
const {
    TEST_DATABASE_URL,
    HTTP_STATUS_CODES
} = require('../app/config');
const User = require('../app/user/user.model');

const { seedEmployeesData, generateOneEmployer } = require('./fakeData');

const {
    generateTestUser,
    generateToken
} = require('./fakeUser');

const expect = chai.expect;

// allow us to use chai.request() method
chai.use(chaiHttp);

let testUser, jwToken;
const employerProperties = ["employerName", "departments"];
const employerUpdatedProperties = ["departments"];

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

function checkResponse(res, statusCode, resType) {
    expect(res).to.have.status(statusCode);
    expect(res).to.be.json;
    expect(res.body).to.be.a(resType);
}

function checkObjectContent(res, keyList, employee) {
    keyList.forEach(function (key) {
        expect(res).to.include.keys(key);
      
    });
}

function checkArrayContent(res, keyList) {
    const employer = res.body[0];
    expect(res.body).to.have.lengthOf.at.least(1);
    expect(employer).to.be.a('object');
    keyList.forEach(function (key) {
        expect(employer).to.include.keys(key);
    })
}

function findOneEmployer() {
     return Employer
        .find()
        .then(function (employers) {
            expect(employers).to.be.a('array');
            expect(employers).to.have.lengthOf.at.least(1);
            return employers[0];
        })
}


describe('Employers API Resource tests', function () {

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

    it('Should get all employers', function () {

        return chai.request(app)
            .get('/api/employer')
            .set('Authorization', `Bearer ${jwToken}`)
            .then(function (res) {
              
                checkResponse(res, HTTP_STATUS_CODES.OK, 'array');
                checkArrayContent(res, employerProperties);
            })
            .catch(function(err) {
                console.log(err);
            });
    });

    it('Should get an employer by employerId', function () {
        let foundEmployer;
        return findOneEmployer()
            .then(function (_foundEmployer) {
                foundEmployer = _foundEmployer;
                return chai.request(app)
                    .get(`/api/employer/${foundEmployer._id}`)
                    .set("Authorization", `Bearer ${jwToken}`)
                })
                .then(function(res) {
                checkResponse(res, HTTP_STATUS_CODES.OK, 'object')
                checkObjectContent(res.body, employerProperties, foundEmployer);
            })
            .catch(function (err) {
                console.log(err);
            })
    })
 
    it('Should create an employer', function () {
       
         return generateOneEmployer()
         .then(function(newEmployer) {            
             return chai.request(app)
             .post('/api/employer')
             .set("Authorization", `Bearer ${jwToken}`)
             .send(newEmployer)
          
         })
        .then(function (res) {
            checkResponse(res, HTTP_STATUS_CODES.CREATED, 'object');
            checkObjectContent(res.body, employerProperties);
        })
        .catch(function(err) {
            console.log(err);
        });
    });
    
    it('Should update employer by employerId', function () {

        let foundEmployer, updateEmployer;

        return Department.findOne()
            .then(function(department) {
                updateEmployer = {
                    departments: [department._id]
                }
                return findOneEmployer()
            })
            
            .then(function (_foundEmployer) {
                foundEmployer = _foundEmployer;
                updateEmployer.id = foundEmployer._id;
                return chai.request(app)
                    .put(`/api/employer/${foundEmployer._id}`)
                    .set("Authorization", `Bearer ${jwToken}`)
                    .send(updateEmployer)
            })
            .then(function (res) {
                checkResponse(res, HTTP_STATUS_CODES.OK, 'object')
                checkObjectContent(res.body, employerUpdatedProperties, foundEmployer);
            })

        .catch(function (err) {
            console.log(err);
        });
    });

    it('Should delete employer by employerId', function () {
      
        return findOneEmployer()
        .then(function (foundEmployer) {
           
            return chai.request(app)
            .delete(`/api/employer/${foundEmployer.id}`)
            .set("Authorization", `Bearer ${jwToken}`)
        })
        .then(function (res) {
            checkResponse(res, HTTP_STATUS_CODES.OK, 'object');
            let responseKeys = ["deleted", "OK"];
            checkObjectContent(res.body, responseKeys);
        })
        .catch(function(err) {
            console.log(err);
        });
    });                 
})