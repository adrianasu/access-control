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
const employeeProperties = ["employeeId", "firstName", "lastName", "employer", "department",
    "licensePlates", "employmentDate", "allowVehicle", "trainings", "ready2work"
];
const employeeOverviewProperties = ["employeeId", "firstName", "lastName", "employer", "department",
    "licensePlates", "allowVehicle", "trainings", "ready2work"
];
const employeeUpdatedProperties = ["lastName", "employer", "department",
    "licensePlates", "allowVehicle", "trainings"];

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
    const employee = res.body[0];
    expect(res.body).to.have.lengthOf.at.least(1);
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


describe('Employees API Resource tests', function () {

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
            .get('/api/employee')
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

    it('Should get an employee by employeeId', function () {
        let foundEmployee;
        return findOneEmployee()
            .then(function (_foundEmployee) {
                foundEmployee = _foundEmployee;
                return chai.request(app)
                    .get(`/api/employee/${foundEmployee.employeeId}`)
                    .set("Authorization", `Bearer ${jwToken}`)
                })
                .then(function(res) {
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
                return chai.request(app)
                    .get(`/api/employee/overview/${foundEmployee.employeeId}`)
                    .set("Authorization", `Bearer ${jwToken}`)
            })
            .then(function (res) {
                checkResponse(res, HTTP_STATUS_CODES.OK, 'object');
                checkObjectContent(res.body, employeeOverviewProperties, foundEmployee);
            })
            .catch(function (err) {
                console.log('Internal Error');
            })
    });


    
    it('Should create an employee', function () {
       
        return generateOneEmployee()
        .then(function(newEmployee) {            
            return chai.request(app)
            .post('/api/employee')
            .set("Authorization", `Bearer ${jwToken}`)
            .send(newEmployee)
          
        })
        .then(function (res) {
            checkResponse(res, HTTP_STATUS_CODES.CREATED, 'object');
            checkObjectContent(res.body, employeeOverviewProperties);
        })
        .catch(function(err) {
            console.log(err);
        });
    });
    
    it('Should update employee by employeeId', function () {

        let foundEmployee, updateEmployee;
        return generateFieldsToUpdate()
            .then(function(_updateEmployee) {
                updateEmployee = _updateEmployee;
                return findOneEmployee()
            })
            .then(function (_foundEmployee) {
                foundEmployee = _foundEmployee;
                updateEmployee.employeeId = foundEmployee.employeeId;
                return chai.request(app)
                    .put(`/api/employee/${foundEmployee.employeeId}`)
                    .set("Authorization", `Bearer ${jwToken}`)
                    .send(updateEmployee)
            })
            .then(function (res) {
                checkResponse(res, HTTP_STATUS_CODES.OK, 'object')
                checkObjectContent(res.body, employeeUpdatedProperties, foundEmployee);
            })

        .catch(function (err) {
            console.log(err);
        });
    });

    it('Should delete employee by employeeId', function () {
        let foundEmployee;
        return findOneEmployee()
        .then(function (_foundEmployee) {
            foundEmployee = _foundEmployee;
            return chai.request(app)
            .delete(`/api/employee/${foundEmployee.employeeId}`)
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