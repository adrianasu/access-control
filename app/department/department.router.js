const express = require('express');
const Joi = require('joi');
const departmentRouter = express.Router();

const { HTTP_STATUS_CODES } = require('../config');
const { jwtPassportMiddleware } = require('../auth/auth.strategy');
const { Department, Employer, Employee } = require('../employee/employee.model');
const User  = require('../user/user.model');

// schema to validate department content
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
    
            return Department
                .find({}, null, {sort: {departmentName: 1}})  // sort alphabetically by department name
                .then(departments => {
                    console.log(`Getting all departments`);
                     let jsonDepartments = [];
                     departments.forEach(department => {
                       
                         jsonDepartments.push(department.serializeDep());
                     })
                     return jsonDepartments;
                     })
                     .then(jsonDepartments => {
                         return res.status(HTTP_STATUS_CODES.OK).json(jsonDepartments);

                     })
            
            .catch(err => {
                return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
            });
});

// get one department by id
departmentRouter.get('/:departmentId', 
jwtPassportMiddleware, 
User.hasAccess(User.ACCESS_PUBLIC), (req, res) => {
    
    return Department
        .findOne({_id: req.params.departmentId})
        
        .then(department => {
            console.log(`Getting new department with id: ${req.params.departmentId}`);
            return res.status(HTTP_STATUS_CODES.OK).json(department);
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
    }
   
    // validate newdepartment data using Joi schema
    const validation = Joi.validate(newDepartment, DepartmentJoiSchema);
    if (validation.error) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
            err: validation.error.details[0].message
        });
    }
    // attempt to create a new department
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


// update department's by id
departmentRouter.put('/:departmentId', jwtPassportMiddleware,
    User.hasAccess(User.ACCESS_ADMIN),
    (req, res) => {
        // check that id in request body matches id in request path
        if (req.params.departmentId !== req.body.id) {
            const message = `Request path id ${req.params.departmentId} and request body id ${req.body.id} must match`;
            console.log(message);
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                err: message
            });
        }

        const updateableFields = ["departmentName"];
        // check what fields were sent in the request body to update
        const toUpdate = {};
          updateableFields.forEach(field => {
            if (updateableFields in req.body) {
                toUpdate[field] = req.body[field];
            }
        });
        // if request body doesn't contain any updateable field send error message
        if (toUpdate.length === 0) {
            const message = `Missing \`${updateableFields.join('or ')}\` in request body`;
            console.log(message);
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                err: message
            });
        }

        const validation = Joi.validate(toUpdate, DepartmentJoiSchema);

        if (validation.error) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                err: validation.error.details[0].message
            });
        }


       return Department
            // $set operator replaces the value of a field with the specified value
            .findByIdAndUpdate(req.params.departmentId, {
                $set: toUpdate
            }, {
                new: true
            })
            .then(updatedDepartment => {
                console.log(`Updating department with id: \`${req.params.departmentId}\``);
                return res.status(HTTP_STATUS_CODES.OK).json(updatedDepartment);
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

    return Employee
        .updateMany({department: req.params.departmentId}, {$set: {department: null}},
            {safe: true, multi: true})
    .then(employee => {
        console.log(`Deleting department from Employee collection`);
        return Employer
        .updateMany({}, {$pull: {departments: req.params.departmentId}},
            {safe: true, multi: true})
    }) 
    .then(employer => {
        console.log(`Deleting department from Employer collection`);
        return Department
        .findOneAndDelete({
            _id: req.params.departmentId
        })
    })
    .then(deletedDepartment => {
        console.log(`Deleting department with id: \`${req.params.departmentId}\``);
        return res.status(HTTP_STATUS_CODES.OK).json({
            deleted: `${req.params.departmentId}`,
            OK: "true"
        });
    })
 
    .catch(err => {
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
    });

});


module.exports = { departmentRouter };


