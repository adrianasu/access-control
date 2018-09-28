const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { app, runServer, closeServer } = require('../app/server');
//const { Employee } = require('../app/employee/employee.model');
const { TEST_DATABASE_URL, HTTP_STATUS_CODES } = require('../app/config');
const  User  = require('../app/user/user.model');

const { seedEmployeesData } = require('./fakeData');
const { generateTestUser, generateToken } = require('./fakeUser');

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

function checkObjectContent(res, keyList) {
    keyList.forEach(function(key) {
        expect(res).to.include.keys(key);
    });

}

function checkArrayContent(res, keyList) {
    expect(res.body).to.have.lengthOf.at.least(1);
    const employee = res.body[0];
    expect(employee.employer).to.be.a('object');
    keyList.forEach(function (key) {
        expect(employee).to.include.keys(key);
    })
}

describe('Employees API Resource', function() {
    let testUser, jwToken;
    const employeeProperties = ["id", "employeeId", "firstName", "lastName", "employer", "department",
            "licensePlates", "employmentDate", "allowVehicle", "trainings", "ready2work"];
    const employeeOverviewProperties = ["employeeId", "firstName", "lastName", "employer", "department",
        "licensePlates", "allowVehicle", "trainings", "ready2work"];

    before(function() {
        return runServer(TEST_DATABASE_URL);
    });
   
    beforeEach(function() {
        testUser = generateTestUser();
        return generateToken(testUser)
            .then(_jwToken => {
                jwToken = _jwToken;
                return seedEmployeesData()
            })
            .catch(console.error)  
    });

    afterEach(function() {
        return tearDownDb();
    });

    after(function() {
        return closeServer();
    });

    // it('Should get all employees', function() {
    //     return chai.request(app)
    //         .get('/employee')
    //         .set('Authorization', `Bearer ${jwToken}`)
    //         .then(function(res) {
    //            /// //if (req.user.accessLevel >= User.ACCESS_ADMIN) {
    //                 checkResponse(res, HTTP_STATUS_CODES.OK, 'array');
    //                 expect(res.body.length).to.be.at.least(1);
    //                 checkArrayContent(res, employeeProperties);
    //         ///    // }
    //         ///    // else {
    //         ///    //    expect error
    //         ///    // }
    //         })
    //         .catch(err => {
    //             console.log('Internal Error', err);
    //             res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send(err);
    //         });
    // });

    it('Should get an employee by id', function () {
        return chai.request(app)
            .get('/employee')
            .set('Authorization', `Bearer ${jwToken}`)
            .then(function(employees) {
                return chai.request(app)
                    .get(`/employee/:${employees[0].id}`)
                    .set("Authorization", `Bearer ${jwToken}`)
            })
            .then(function (res) {
                expect(res.body.length).to.be.at.least(1);
                checkResponse(res, HTTP_STATUS_CODES.OK, 'object')
                checkObjectContent(res, employeeProperties);
            })
            .catch(err => {
                console.log('Internal Error There');
                res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send(err);
            });
    });

    // it(`Should get employee's overview`, function () {
    //     return chai.request(app)
    //         .get('/employee')
    //         .then(function (employees) {
    //             return chai.request(app)
    //                 .get('/employee/overview/:employeeId')
    //                 .set("Authorization", `Bearer ${jwToken}`)
    //         })
    //         .then(function (res) {
    //             checkResponse(res, HTTP_STATUS_CODES.OK, 'object');
    //             expect(res.body.length).to.be.at.least(1);
    //             checkContent(res, employeeOverviewProperties);
    //         })
    //         .catch(err => {
    //             console.log('Internal Error');
    //             res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send(err);
    //         });
    // });

    // it('Should create an employee', function () {
    //     const newEmployee = {
    //         //updatedBy: 
    //         employeeId: "gtefjs",
    //         //photo: 
    //         firstName: "Ashley",
    //         lastName: "Hill",
    //         employer: {
    //             employerName: "Metal Works",
    //             departments: [
    //                 {departmentName: "Logistics"}
    //             ]
    //         },
    //         department: {departmentName: "Logistics"},
    //         licensePlates: ["12ABC45"],
    //         employmentDate: new Date(),
    //         allowVehicle: true,
    //         trainings: [{trainingInfo: {}, trainingDate: null}]
    //     }
    //     return chai.request(app)
    //         .post('/employee')
    //         .set("Authorization", `Bearer ${jwToken}`)
    //         .send(newEmployee)
    //         .then(function (res) {
    //             checkResponse(res, HTTP_STATUS_CODES.OK, 'object');
    //             expect(res.body.length).to.be.at.least(1);
    //             checkContent(res, employeeProperties);
    //         })
    //         .catch(err => {
    //             console.log('Internal Error');
    //             res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send(err);
    //         });
    // });

    //  it('Should edit employee by id', function () {
    //      return chai.request(app)
    //          .put('/:employeeId')
    //          .set("Authorization", `Bearer ${jwToken}`)
    //          .then(function (res) {
    //              checkResponse(res, HTTP_STATUS_CODES.OK, 'object');
    //              expect(res.body.length).to.be.at.least(1);
    //              checkContent(res, employeeProperties);
    //          })
    //          .catch(err => {
    //              console.log('Internal Error');
    //              res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send(err);
    //          });
    //  });

    //  it('Should delete employee by id', function () {
    //      return chai.request(app)
    //          .delete('/employee/:employeeId')
    //          .set("Authorization", `Bearer ${jwToken}`)
    //          .then(function (res) {
    //              checkResponse(res, HTTP_STATUS_CODES.OK, 'object');
    //              expect(res.body.length).to.be.at.least(1);
    //              let responseKeys = ["deleted", "OK"];
    //              checkContent(res, responseKeys);
    //          })
    //          .catch(err => {
    //              console.log('Internal Error');
    //              res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send(err);
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