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
// test for the lowest access level
const userAccessLevel = User.ACCESS_OVERVIEW_ONLY;
const employeeOverviewProperties = ["employeeId", "firstName", "lastName", "employer", "department",
    "licensePlates", "allowVehicle", "trainings", "ready2work"
];

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

// function checkArrayContent(res, keyList) {
//     const employee = res.body[0];
//     expect(res.body).to.have.lengthOf.at.least(1);
//     expect(employee.employer).to.be.a('object');
//     keyList.forEach(function (key) {
//         expect(employee).to.include.keys(key);
//     })
// }

function findOneEmployee() {
     return Employee
        .find()
        .then(function (employees) {
            expect(employees).to.be.a('array');
            expect(employees).to.have.lengthOf.at.least(1);
            return employees[0];
        })
}


describe('Employees API Resource edge cases tests', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        testUser = generateTestUser(userAccessLevel);
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

    it('Should not allow to get all employees', function () {

        return chai.request(app)
            .get('/employee')
            .set('Authorization', `Bearer ${jwToken}`)
            .then(function (res) {
                
                //expect(res.body.length).to.be.at.least(1);
                //checkArrayContent(res);
                checkResponse(res, HTTP_STATUS_CODES.UNAUTHORIZED, 'object');
            })
            .catch(function(err) {
                console.log("Unauthorized user");
            });
    });

    // it('Should not allow to get an employee by id', function () {
    //     let foundEmployee;
    //     return findOneEmployee()
    //         .then(function (_foundEmployee) {
    //             foundEmployee = _foundEmployee;
    //             return chai.request(app)
    //                 .get(`/employee/${foundEmployee.id}`)
    //                 .set("Authorization", `Bearer ${jwToken}`)
    //             })
    //             .then(function(res) {
    //             checkResponse(res, HTTP_STATUS_CODES.UNAUTHORIZED, 'object')
    //             //checkObjectContent(res.body, employeeProperties, foundEmployee);
    //         })
    //         .catch(function (err) {
    //             console.log("Unauthorized user");
    //         })
    // })

    // it(`Should get employee's overview`, function () {
    //     let foundEmployee;
    //     return findOneEmployee()
    //         .then(function (_foundEmployee) {
    //             foundEmployee = _foundEmployee;
    //             return chai.request(app)
    //                 .get(`/employee/overview/${foundEmployee.id}`)
    //                 .set("Authorization", `Bearer ${jwToken}`)
    //         })
    //         .then(function (res) {
    //             checkResponse(res, HTTP_STATUS_CODES.OK, 'object');
    //             checkObjectContent(res.body, employeeOverviewProperties, foundEmployee);
    //         })
    //         .catch(function (err) {
    //             console.log('Internal Error');
    //         })
    // });

    // it('Should not allow to create an employee', function () {
       
    //     return generateOneEmployee()
    //     .then(function(newEmployee) {            
    //         return chai.request(app)
    //         .post('/employee')
    //         .set("Authorization", `Bearer ${jwToken}`)
    //         .send(newEmployee)
          
    //     })
    //     .then(function (res) {
    //         checkResponse(res, HTTP_STATUS_CODES.UNAUTHORIZED, 'object');
    //         //checkObjectContent(res.body, employeeOverviewProperties);
    //     })
    //     .catch(function(err) {
    //         console.log("Unauthorized user");
    //     });
    // });
    
    // it('Should not allow to update employee by id', function () {

    //     let foundEmployee, updateEmployee;
    //     return generateFieldsToUpdate()
    //         .then(function(_updateEmployee) {
    //             updateEmployee = _updateEmployee;
    //             return findOneEmployee()
    //         })
    //         .then(function (_foundEmployee) {
    //             foundEmployee = _foundEmployee;
    //             updateEmployee.id = foundEmployee.id;
    //             return chai.request(app)
    //                 .put(`/employee/${foundEmployee.id}`)
    //                 .set("Authorization", `Bearer ${jwToken}`)
    //                 .send(updateEmployee)
    //         })
    //         .then(function (res) {
    //             checkResponse(res, HTTP_STATUS_CODES.UNAUTHORIZED, 'object')
    //             //checkObjectContent(res.body, employeeUpdatedProperties, foundEmployee);
    //         })

    //     .catch(function (err) {
    //         console.log("Unauthorized user");
    //     });
    // });

    // it('Should not allow to delete employee by id', function () {
    //     let foundEmployee;
    //     return findOneEmployee()
    //     .then(function (_foundEmployee) {
    //         foundEmployee = _foundEmployee;
    //         return chai.request(app)
    //         .delete(`/employee/${foundEmployee.id}`)
    //         .set("Authorization", `Bearer ${jwToken}`)
    //     })
    //     .then(function (res) {
    //         checkResponse(res, HTTP_STATUS_CODES.UNAUTHORIZED, 'object');
    //         let responseKeys = ["deleted", "OK"];
    //         //checkObjectContent(res.body, responseKeys);
    //     })
    //     .catch(function(err) {
    //         console.log("Unauthorized user");
    //     });
    // });                 
})