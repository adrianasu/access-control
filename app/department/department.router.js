const express = require('express');
const Joi = require('joi');
const departmentRouter = express.Router();

const { HTTP_STATUS_CODES } = require('../config');
const { jwtPassportMiddleware } = require('../auth/auth.strategy');
const { Department } = require('../employee/employee.model');

const DepartmentJoiSchema = Joi.object().keys({
        _id: Joi.string(),
        __v: Joi.number(),
        departmentName: Joi.string()
    });

// get all departments 
departmentRouter.get('/', 
    jwtPassportMiddleware, 
    User.hasAccess(User.ACCESS_PUBLIC), 
    (req, res) => {
    
            Department
                .find()
                .then(departments => {
                    console.log(`Getting all departments`);
                    let jsonDepartments = [];
                    departments.forEach(department => {
                        jsonDepartments.push(department);
                    })
                    return jsonDepartments;
                })
                .then(jsonDepartments => {
                    return res.status(HTTP_STATUS_CODES.OK).json(jsonDepartments)
                })
            
            .catch(err => {
                
                return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
            });
});


// get one department by id
departmentRouter.get('/:departmentId', jwtPassportMiddleware, User.hasAccess(User.ACCESS_PUBLIC), (req, res) => {
    
            return Department
                .findOne({departmentId: req.params.departmentId})
        
        .then(department => {
            //console.log(department);
            console.log(`Getting new department with id: ${req.params.departmentId}`);
            return department;
        })
        .then(jsonDepartment => {
            //console.log(jsonDepartment);
            return res.status(HTTP_STATUS_CODES.OK).json(jsonDepartment);
        })
        .catch(err => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
        });
});
// create new department
departmentRouter.post('/', 
    jwtPassportMiddleware, 
    User.hasAccess(User.ACCESS_ADMIN), 
    (req, res) => {
   
    // we can access req.body payload bc we defined express.json() middleware in server.js
    const newDepartment = {
        departmentName: req.body.departmentName,
        departments: req.body.departments,
    }
   
    // validate newdepartment data using Joi schema
    const validation = Joi.validate(newDepartment, departmentJoiSchema);
    if (validation.error) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }
            // attempt to create a new employee
            return Department
            .create(newDepartment)
            
            .then(createdDepartment => {
                console.log(`Creating new department`);
                return res.status(HTTP_STATUS_CODES.CREATED).json(createdDepartment);
            })
            .catch(err => {
                return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
            });
});

// delete department by id
departmentRouter.delete('/:departmentId', 
    jwtPassportMiddleware, 
    User.hasAccess(User.ACCESS_ADMIN), 
    (req, res) => {
    return Department
        .findOneAndDelete({departmentId: req.params.departmentId})
        .then(deletedDepartment => {
            console.log(`Deleting department with id: \`${req.params.departmentId}\``);
            res.status(HTTP_STATUS_CODES.OK).json({
                deleted: `${req.params.departmentId}`,
                OK: "true"
            });
        })
        .catch(err => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).res(err);
        });

});


module.exports = { employeeRouter };


