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
const User = require('../app/user/user.model');

const {
    seedEmployeesData,
    generateOneEmployee
} = require('./fakeData');
const {
    generateTestUser,
    generateToken
} = require('./fakeUser');

const expect = chai.expect;

// allow us to use chai.request() method
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

function checkObjectContent(res, keyList, employee) {
    keyList.forEach(function (key) {
        expect(res).to.include.keys(key);
        // expect(res.body).to.deep.include({
        //     [key]: employee[key],
        // })
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

function findOneEmployee() {
     return Employee
        .find()
        .then(function (employees) {
            expect(employees).to.be.a('array');
            expect(employees).to.have.lengthOf.at.least(1);
            return employees[0];
        })
}

let testUser, jwToken;
const employeeProperties = ["id", "employeeId", "firstName", "lastName", "employer", "department",
    "licensePlates", "employmentDate", "allowVehicle", "trainings", "ready2work"
];
const employeeOverviewProperties = ["employeeId", "firstName", "lastName", "employer", "department",
    "licensePlates", "allowVehicle", "trainings", "ready2work"
];


describe('Employees API Resource', function () {

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

    it('Should get all employees', function () {

        return chai.request(app)
            .get('/employee')
            .set('Authorization', `Bearer ${jwToken}`)
            .then(function (res) {
                expect(res.body.length).to.be.at.least(1);
                checkArrayContent(res, employeeProperties);
                checkResponse(res, HTTP_STATUS_CODES.OK, 'array');
            })
            .catch(function(err) {
                console.log(err);
            });
    });

    it('Should get an employee by id', function () {
        let foundEmployee;
        return findOneEmployee()
            .then(function (_foundEmployee) {
                foundEmployee = _foundEmployee;
                //console.log(foundEmployee);
                return chai.request(app)
                    .get(`/employee/${foundEmployee.id}`)
                    .set("Authorization", `Bearer ${jwToken}`)
                })
                .then(function(res) {
                //expect(res.body.length).to.be.at.least(1);
                checkResponse(res, HTTP_STATUS_CODES.OK, 'object')
                checkObjectContent(res.body, employeeProperties, foundEmployee);
            })
            .catch(function (err) {
                console.log(err);
            })
    })

    it(`Should get employee's overview`, function () {
        let foundEmployee;
        return findOneEmployee()
            .then(function (_foundEmployee) {
                foundEmployee = _foundEmployee;
                //console.log(foundEmployee);
                return chai.request(app)
                    .get(`/employee/overview/${foundEmployee.id}`)
                    .set("Authorization", `Bearer ${jwToken}`)
            })
            .then(function (res) {
                //expect(res.body.length).to.be.at.least(1);
                checkResponse(res, HTTP_STATUS_CODES.OK, 'object');
                checkObjectContent(res.body, employeeOverviewProperties, foundEmployee);
            })
            .catch(function (err) {
                console.log('Internal Error');
            })
    });


    /// Test fail when accessLevel< requiredLevel for overview endpoint

    it('Should create an employee', function () {
        
        return generateOneEmployee()
            .then(function(newEmployee) {
                console.log("CREATE", newEmployee);

                return chai.request(app)
                    .post('/employee')
                    .set("Authorization", `Bearer ${jwToken}`)
                    .send(newEmployee)
            })
            .then(function (res) {
                checkResponse(res, HTTP_STATUS_CODES.CREATED, 'object');
                //expect(res.body.length).to.be.at.least(1);
                checkObjectContent(res.body, employeeOverviewProperties);
            })
            .catch(function(err) {
                console.log(err);
            });
    });

    //  it('Should edit employee by id', function () {
    //      return chai.request(app)
    //          .put('/:employeeId')
    //          .set("Authorization", `Bearer ${jwToken}`)
    //          .then(function (res) {
    //              checkResponse(res, HTTP_STATUS_CODES.OK, 'object');
    //              expect(res.body.length).to.be.at.least(1);
    //              checkContent(res, employeeProperties);
    //          })
    //          .catch(function(err) {
    //              console.log('Internal Error');
    //              res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send(err);
    //          });
    //  });

     it('Should delete employee by id', function () {
         let foundEmployee;
         return findOneEmployee()
            .then(function (_foundEmployee) {
                foundEmployee = _foundEmployee;
                return chai.request(app)
                .delete(`/employee/${foundEmployee.id}`)
                .set("Authorization", `Bearer ${jwToken}`)
            })
            .then(function (res) {
                checkResponse(res, HTTP_STATUS_CODES.OK, 'object');
                //expect(res.body.length).to.be.at.least(1);
                let responseKeys = ["deleted", "OK"];
                checkObjectContent(res.body, responseKeys);
             })
             .catch(function(err) {
                 console.log(err);
             });
     });


    //  it('Should allow user to login', function () {
    //      return chai.request(app)
    //          .post('/login')
    //          .then(function (res) {
    //              expect(res).to.have.status(200);
    //          })
    //          .catch(function(err) {
    //              console.log('Internal Error');
    //              res.status(500).send(err);
    //          });
    //  });

})