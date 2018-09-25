const express = require('express');
const Joi = require('joi');
const employeeRouter = express.Router();

const { HTTP_STATUS_CODES } = require('../config');
const { jwtPassportMiddleware } = require('../auth/auth.strategy');
const { Employee, EmployeeJoiSchema, UpdateEmployeeJoiSchema } = require('./employee.model');

// get all employees
employeeRouter.get('/', jwtPassportMiddleware, (req, res) => {
    Employee
        .find()
        .then(employees => {
            console.log(`Getting all employees (employeeRouter)`);
            return res.status(HTTP_STATUS_CODES.OK).json(
                employees.map(employee => employee.serialize()));
        })
        .catch(err => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
        });
});

// get one employee by id
employeeRouter.get('/:employeeId', jwtPassportMiddleware, (req, res) => {
    Employee
        .findById(req.params.employeeId)
        .then(employee => {
            console.log(`Getting new employee with id: ${req.params.employeeId}`);
            return res.status(HTTP_STATUS_CODES.OK).json(employee.serialize());
        })
        .catch(err => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
        });
});

// create new employee
employeeRouter.post('/', jwtPassportMiddleware, (req, res) => {
    // we can access req.body payload bc we defined express.json() middleware in server.js
    const newEmployee = {
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

    // validate newEmployee data using Joi schema
    const validation = Joi.validate(newEmployee, EmployeeJoiSchema);
    if (validation.error) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }

    // attempt to create a new employee
    Employee
        .create(newEmployee)
        .then(createdEmployee => {
            console.log(`Creating new employee`);
            return res.status(HTTP_STATUS_CODES.CREATED).json(createdEmployee.serialize());
        })
        .catch(err => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
        });
});

// update employee by id
employeeRouter.put('/:employeeId', jwtPassportMiddleware, (req, res) => {
    // check that id in request body matches id in request path
    if (req.params.employeeId !== req.body.id) {
        const message = `Request path id ${req.params.employeeId} and request body id ${req.body.id} must match`;
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
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error});
    }

    Employee
    // $set operator replaces the value of a field with the specified value
        .findByIdAndUpdate(req.params.employeeId, { $set: toUpdate }, { new: true })
        .then(updatedEmployee => {
            console.log(`Updating employee with id: \`${req.params.employeeId}\``);
            return res.status(HTTP_STATUS_CODES.OK).json(updatedEmployee.serialize());
        })
        .catch(err => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
        });
});

// delete employee by id
employeeRouter.delete('/:employeeId', jwtPassportMiddleware, (req, res) => {
    Employee
        .findByIdAndDelete(req.params.employeeId)
        .then(deletedEmployee => {
            console.log(`Deleting employee with id: \`${req.params.id}\``);
            res.status(HTTP_STATUS_CODES.OK).json({ deleted: `${req.params.employeeId}`, OK: "true"});
        })
        .catch(err => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).res(err);
        });
});

module.exports = { employeeRouter };