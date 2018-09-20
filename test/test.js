const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { app, runServer, closeServer } = require('../server');
const { Employees } = require('../models');
const { TEST_DATABASE_URL } = require('../config');

const {
    generateDepartments,
    generateEmployers,
    generateTrainingList,
    generateEmployeeData,
    seedEmployeesData
} = require('../fakeData');

const expect = chai.expect;
chai.use(chaiHttp);

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

function checkResponse(res, statusCode, resType) {
    expect(res).to.have.status(statusCode);
    expect(res).to.be.json;
    expect(res.body).to.be.a(resType);
}

describe('Employees API Resource', function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });
   
    beforeEach(function() {
        this.timeout(10000);
        return seedEmployeesData();
    });

    // afterEach(function() {
    //     return tearDownDb();
    // })

    after(function() {
        return closeServer();
    });

    describe('GET employees endpoint', function() { 

        it('Should all employees ', function() {
            return chai.request(app)
                .get('/list')
                .then(function(res) {
                    checkResponse(res, 200, 'object');
                    expect(res.body.length).to.be.at.least(1);
                    checkContent(res)
                })
                .catch(err => {
                    console.log('Internal Error');
                    res.status(500).send(err);
                });
        });
    });
//////////////////////////////////
   

    //  it('Show info of employee with that id', function () {
    //      return chai.request(app)
    //          .get('/:id')
    //          .then(function (res) {
    //              expect(res).to.have.status(200);
    //          })
    //          .catch(err => {
    //              console.log('Internal Error');
    //              res.status(500).send(err);
    //          });
    //  });

    //  it('Should show employee info', function () {
    //      return chai.request(app)
    //          .get('/entrance/:id')
    //          .then(function (res) {
    //              expect(res).to.have.status(200);
    //          })
    //          .catch(err => {
    //              console.log('Internal Error');
    //              res.status(500).send(err);
    //          });
    //  });

    //  it('Should create employee with that id', function () {
    //      return chai.request(app)
    //          .post('/:id')
    //          .then(function (res) {
    //              expect(res).to.have.status(200);
    //          })
    //          .catch(err => {
    //              console.log('Internal Error');
    //              res.status(500).send(err);
    //          });
    //  });

    //  it('Should edit employee with that id info', function () {
    //      return chai.request(app)
    //          .put('/:id')
    //          .then(function (res) {
    //              expect(res).to.have.status(200);
    //          })
    //          .catch(err => {
    //              console.log('Internal Error');
    //              res.status(500).send(err);
    //          });
    //  });

    //  it('Should delete employee with that id', function () {
    //      return chai.request(app)
    //          .delete('/:id')
    //          .then(function (res) {
    //              expect(res).to.have.status(200);
    //          })
    //          .catch(err => {
    //              console.log('Internal Error');
    //              res.status(500).send(err);
    //          });
    //  });

    
     //  it('Should allow user to login', function () {
     //      return chai.request(app)
     //          .post('/login')
     //          .then(function (res) {
     //              expect(res).to.have.status(200);
     //          })
     //          .catch(err => {
     //              console.log('Internal Error');
     //              res.status(500).send(err);
     //          });
     //  });

})