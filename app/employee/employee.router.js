const express = require('express');
const Joi = require('joi');
const employeeRouter = express.Router();

const { HTTP_STATUS_CODES } = require('../config');
const { jwtPassportMiddleware } = require('../auth/auth.strategy');
const { Employee, EmployeeJoiSchema, UpdateEmployeeJoiSchema, Training } = require('./employee.model');
const User = require('../user/user.model');

function validateEmployeeTrainings(employee, trainings) { 
    let validatedTrainings = [];
    if (trainings) {
        trainings.forEach(training => {
            validatedTrainings.push({
                [training.title]: employee.isValid(training.title)
            });
        })
    return validatedTrainings;
    } 
}

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
                .find()
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


// get one employee by id
employeeRouter.get('/:employeeId', jwtPassportMiddleware, User.hasAccess(User.ACCESS_PUBLIC), (req, res) => {
    let trainings; 
    return Training
        .find()
        .then(_trainings => {
            trainings = _trainings
            return Employee
                .findOne({employeeId: req.params.employeeId})
        })
        .then(employee => {
            //console.log(employee);
            console.log(`Getting new employee with id: ${req.params.employeeId}`);
            return employee.serialize(validateEmployeeTrainings(employee, trainings));
        })
        .then(jsonEmployee => {
            //console.log(jsonEmployee);
            return res.status(HTTP_STATUS_CODES.OK).json(jsonEmployee);
        })
        .catch(err => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
        });
});

// get overview employee by id
employeeRouter.get('/overview/:employeeId', 
    jwtPassportMiddleware, 
    User.hasAccess(User.ACCESS_OVERVIEW_ONLY), 
    (req, res) => {

    let trainings;
    return Training
        .find()
        .then(_trainings => {
            trainings = _trainings
            return Employee
                .findOne({employeeId: req.params.employeeId})
        })
        .then(employee => {
            //console.log(employee);
            console.log(`Getting new employee with id: ${req.params.employeeId}`);
            return employee.serializeOverview(validateEmployeeTrainings(employee, trainings));
        })
        .then(jsonEmployee => {
            //console.log(jsonEmployee);
            return res.status(HTTP_STATUS_CODES.OK).json(jsonEmployee);
        })
        .catch(err => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
        });
});

// create new employee
employeeRouter.post('/', 
    jwtPassportMiddleware, 
    User.hasAccess(User.ACCESS_ADMIN), 
    (req, res) => {
    console.log("User Access Level", req.user.accessLevel);
    // we can access req.body payload bc we defined express.json() middleware in server.js
    const newEmployee = {
        //updatedBy: req.user.id,
        employeeId: req.body.employeeId,
        //photo: req.body.photo,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        employer: req.body.employer,
        department: req.body.department,
        licensePlates: req.body.licensePlates,
        employmentDate: req.body.employmentDate,
        allowVehicle: req.body.allowVehicle,
        trainings: req.body.trainings
    }
    //console.log("CREATE router: ", newEmployee);
    // validate newEmployee data using Joi schema
    const validation = Joi.validate(newEmployee, EmployeeJoiSchema);
    if (validation.error) {
        console.log(validation.error);
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
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
});

// update employee by id 
employeeRouter.put('/:employeeId', 
    jwtPassportMiddleware, 
    User.hasAccess(User.ACCESS_ADMIN), 
    (req, res) => {
    // check that id in request body matches id in request path
    if (req.params.employeeId !== req.body.employeeId) {
        const message = `Request path id ${req.params.employeeId} and request body id ${req.body.employeeId} must match`;
        console.error(message);
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
            message: message
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
            message: message
        });
    }

    const validation = Joi.validate(toUpdate, UpdateEmployeeJoiSchema);
    if (validation.error) {
        console.log(validation.error);
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error});
    }

    Employee
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
            res.status(HTTP_STATUS_CODES.OK).json({
                deleted: `${req.params.employeeId}`,
                OK: "true"
            });
        })
        .catch(err => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).res(err);
        });

});


module.exports = { employeeRouter };


