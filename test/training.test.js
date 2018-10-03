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
    Training
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
const trainingProperties = ["title", "expirationTime"];

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
    const training = res.body[0];
    expect(res.body).to.have.lengthOf.at.least(1);
    expect(training).to.be.a('object');
    keyList.forEach(function (key) {
        expect(training).to.include.keys(key);
    })
}


describe('Training API Resource tests', function () {

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

    it('Should get all Training', function () {

        return chai.request(app)
            .get('/api/training')
            .set('Authorization', `Bearer ${jwToken}`)
            .then(function (res) {
              
                checkResponse(res, HTTP_STATUS_CODES.OK, 'array');
                checkArrayContent(res, trainingProperties);
            })
            .catch(function(err) {
                console.log(err);
            });
    });

    it('Should get a training by trainingId', function () {
       
        return Training
            .findOne()
            .then(function(foundTraining) {
               
                return chai.request(app)
                    .get(`/api/training/${foundTraining.id}`)
                    .set("Authorization", `Bearer ${jwToken}`)
                })
                .then(function(res) {
                checkResponse(res, HTTP_STATUS_CODES.OK, 'object')
                checkObjectContent(res.body, trainingProperties);
            })
            .catch(function (err) {
                console.log(err);
            })
    })
 
    it('Should create a training', function () {
       
        let newTraining = {
            title: "New Training",
            expirationTime: new Date(1000*365*24*60*60)
        }           
             return chai.request(app)
             .post('/api/training')
             .set("Authorization", `Bearer ${jwToken}`)
             .send(newTraining)
         
        .then(function (res) {
            checkResponse(res, HTTP_STATUS_CODES.CREATED, 'object');
            checkObjectContent(res.body, trainingProperties);
        })
        .catch(function(err) {
            console.log(err);
        });
    });
    


it('Should update training by trainingId', function () {

    let foundTraining, updateTraining;
    updateTraining = {
        title: "Update Training"
    }

    return Training
        .findOne()
        .then(function(_foundTraining) {
            foundTraining = _foundTraining;
            updateTraining.id = foundTraining.id;
            return chai.request(app)
                .put(`/api/training/${updateTraining.id}`)
                .set("Authorization", `Bearer ${jwToken}`)
                .send(updateTraining)
        })
        .then(function (res) {
            checkResponse(res, HTTP_STATUS_CODES.OK, 'object')
            checkObjectContent(res.body, trainingProperties, foundTraining);
        })
        .catch(function (err) {
            console.log(err);
        });
    });

    it('Should delete training by trainingId', function () {
      
        return Training
            .findOne()
            .then(function (training) {

                return chai.request(app)
                .delete(`/api/training/${training.id}`)
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