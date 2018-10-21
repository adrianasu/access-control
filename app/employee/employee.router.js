const express = require('express');
const Joi = require('joi');
const employeeRouter = express.Router();
const mongoose = require('mongoose');


const { HTTP_STATUS_CODES } = require('../config');
const { jwtPassportMiddleware } = require('../auth/auth.strategy');
const { Employee, EmployeeJoiSchema, UpdateEmployeeJoiSchema, Training, Photo } = require('./employee.model');
const User = require('../user/user.model');


function validateEmployeeTrainings(employee, trainings) { 
    let validatedTrainings = [];
    if (trainings) {
        trainings.forEach(training => {
            validatedTrainings.push({
                trainingTitle: training.title,
                isValid: employee.isValid(training.title)
            });
        })
    return validatedTrainings;
    } 
}

// create new employee
employeeRouter.post('/',
    jwtPassportMiddleware,
    User.hasAccess(User.ACCESS_PUBLIC), 
    (req, res) => {
          
        // we can access req.body payload bc we defined express.json() middleware in server.js
        const newEmployee = {
            employeeId: req.body.employeeId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            employer: req.body.employer,
            department: req.body.department,
            licensePlates: req.body.licensePlates,
            employmentDate: req.body.employmentDate,
            allowVehicle: req.body.allowVehicle,
            trainings: req.body.trainings
        }

        //validate newEmployee data using Joi schema
        const validation = Joi.validate(newEmployee, EmployeeJoiSchema);
        if (validation.error) {
            console.log(validation.error);
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                err: validation.error.details[0].message
            });
        }

        // check if employee with that employeeId already exists

        return Employee
        .findOne({employeeId: req.body.employeeId})
        .then(employee => {
            if (employee) {
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    err: `An employee with id ${req.body.employeeId} already exists.`
                });
            }
        
        let trainings;

        return Training
            .find()
            .then(_trainings => {
                trainings = _trainings
                // attempt to create a new employee
                return Employee
                    .create(newEmployee)
            })
            .then(createdEmployee => {
                console.log(`Creating new employee`);
                return res.status(HTTP_STATUS_CODES.CREATED).json(createdEmployee.serialize(validateEmployeeTrainings(createdEmployee, trainings)));
            })
            .catch(err => {
                return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
            });
        })
});

// get all employees 
employeeRouter.get('/', 
jwtPassportMiddleware, 
User.hasAccess(User.ACCESS_PUBLIC), 
    (req, res) => {
   
       
    // get trainings to validate employee's trainings status
     Training
         .find()
         .then(trainings => {
            Employee
                .find({}, null, {sort: {lastName: 1}})  // sort alphabetically by last name
                .then(employees => {
                    console.log(`Getting all employees`);
                    let jsonEmployees = [];
                    employees.forEach(employee => {
                        jsonEmployees.push(employee.serialize(validateEmployeeTrainings(employee, trainings)));
                    })
                    return jsonEmployees;
                })
                .then(jsonEmployees => {
                    return res.status(HTTP_STATUS_CODES.OK).json(jsonEmployees)
                })
            })
            .catch(err => {
                
                return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
            });
});

// get all employees' desk overviews 
employeeRouter.get('/desk',
    jwtPassportMiddleware,
    User.hasAccess(User.ACCESS_OVERVIEW),
    (req, res) => {


        // get trainings to validate employee's trainings status
        Training
            .find()
            .then(trainings => {
                Employee
                    .find({}, null, {sort: {lastName: 1}})
                    .then(employees => {
                        console.log(`Getting all employees`);
                        let jsonEmployees = [];
                        employees.forEach(employee => {
                            jsonEmployees.push(employee.serializeDeskOverview(validateEmployeeTrainings(employee, trainings)));
                        })
                        return jsonEmployees;
                    })
                    .then(jsonEmployees => {
                        return res.status(HTTP_STATUS_CODES.OK).json(jsonEmployees)
                    })
            })
            .catch(err => {

                return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
            });
    });

// get all employees' kiosk overviews 
employeeRouter.get('/kiosk',
    jwtPassportMiddleware,
    User.hasAccess(User.ACCESS_OVERVIEW),
    (req, res) => {


        // get trainings to validate employee's trainings status
        Training
            .find()
            .then(trainings => {
                Employee
                    .find({}, null, {sort: {lastName: 1}})
                    .then(employees => {
                        console.log(`Getting all employees`);
                        let jsonEmployees = [];
                        employees.forEach(employee => {
                            jsonEmployees.push(employee.serializeKioskOverview(validateEmployeeTrainings(employee, trainings)));
                        })
                        return jsonEmployees;
                    })
                    .then(jsonEmployees => {
                        return res.status(HTTP_STATUS_CODES.OK).json(jsonEmployees)
                    })
            })
            .catch(err => {

                return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
            });
    });


// get one employee by id
employeeRouter.get('/:employeeId', 
jwtPassportMiddleware, 
User.hasAccess(User.ACCESS_PUBLIC), 
(req, res) => {
    let trainings; 
    return Training
        .find()
        .then(_trainings => {
            trainings = _trainings
            return Employee
                .findOne({employeeId: req.params.employeeId})
                .then(employee => {
                    console.log(employee);
                    console.log(`Getting new employee with id: ${req.params.employeeId}`);
                    return employee.serialize(validateEmployeeTrainings(employee, trainings));
                })
                .then(jsonEmployee => {
                    //console.log(jsonEmployee);
                    return res.status(HTTP_STATUS_CODES.OK).json(jsonEmployee);
                })
                .catch(err => {
                    return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                        err: "Employee not found"});
                })
        })
        .catch(err => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                err: "Something went wrong. Please try again"
            });
        })
});

// get overview employee by id reception desk version
employeeRouter.get('/desk/:employeeId', 
jwtPassportMiddleware, 
User.hasAccess(User.ACCESS_OVERVIEW), 
    (req, res) => {

    let trainings;
    return Training
        .find()
        .then(_trainings => {
            trainings = _trainings
            return Employee
            .findOne({employeeId: req.params.employeeId})
            .then(employee => {
              
                console.log(`Getting new employee with id: ${req.params.employeeId}`);
                return employee.serializeDeskOverview(validateEmployeeTrainings(employee, trainings));
            })
            .then(jsonEmployee => {
               
                return res.status(HTTP_STATUS_CODES.OK).json(jsonEmployee);
            })
            .catch(err => {
                return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    err: "Employee not found"});
            })
        })
        .catch(err => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({err: "Something went wrong. Please try again"});
        })
});

// get overview employee by id kiosk version (no authorization required)
employeeRouter.get('/kiosk/:employeeId', 
    (req, res) => {

        let trainings;
        return Training
            .find()
            .then(_trainings => {
                trainings = _trainings
                return Employee
                    .findOne({
                        employeeId: req.params.employeeId
                    })
                    .then(employee => {

                        console.log(`Getting new employee with id: ${req.params.employeeId}`);
                        return employee.serializeKioskOverview(validateEmployeeTrainings(employee, trainings));
                    })
                    .then(jsonEmployee => {

                        return res.status(HTTP_STATUS_CODES.OK).json(jsonEmployee);
                    })
                    .catch(err => {
                        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                            err: "Employee not found"
                        });
                    })
            })
            .catch(err => {
                return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    err: "Something went wrong. Please try again"
                });
            })
    });

// update employee by id 
employeeRouter.put('/:employeeId', 
jwtPassportMiddleware, 
User.hasAccess(User.ACCESS_PUBLIC), 
    (req, res) => {
    // check that id in request body matches id in request path
    if (req.params.employeeId !== req.body.employeeId) {
        const message = `Request path id ${req.params.employeeId} and request body id ${req.body.employeeId} must match`;
        console.error(message);
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
            err: message
        });
    }

    // we only support a subset of fields being updateable
    // if the user sent over any of them 
    // we update those values on the database
    const updateableFields = ["photo", "firstName", "lastName", "employer",
         "department", "licensePlates", "employmentDate", "allowVehicle",
          "trainings"];
    // check what fields were sent in the request body to update
    const toUpdate = {};
    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });
    // if request body doesn't contain any updateable field send error message
    if (toUpdate.length === 0) {
        const message = `Missing \`${updateableFields.join('or ')}\` in request body`;
        console.error(message);
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
            err: message
        });
    }

    const validation = Joi.validate(toUpdate, UpdateEmployeeJoiSchema);
    if (validation.error) {
  
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
            err: validation.error.details[0].message
        });
    } 

    return Employee
    // $set operator replaces the value of a field with the specified value
        .findOneAndUpdate({employeeId: req.params.employeeId}, { $set: toUpdate }, { new: true })
        .then(updatedEmployee => {
            console.log(`Updating employee with id: \`${req.params.employeeId}\``);
            return res.status(HTTP_STATUS_CODES.OK).json(updatedEmployee.serialize());
        })
        .catch(err => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
        });
});

// delete employee by id
employeeRouter.delete('/:employeeId', 
jwtPassportMiddleware, 
User.hasAccess(User.ACCESS_ADMIN), 
    (req, res) => {
    return Employee
        .findOneAndDelete({employeeId: req.params.employeeId})
        .then(deletedEmployee => {
            console.log(`Deleting employee with id: \`${req.params.employeeId}\``);
            return res.status(HTTP_STATUS_CODES.OK).json({
                deleted: `${req.params.employeeId}`,
                OK: "true"
            });
        })
        .catch(err => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({err: err});
        });

});


module.exports = { employeeRouter };


