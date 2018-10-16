const express = require('express');
const Joi = require('joi');
const employerRouter = express.Router();

const { HTTP_STATUS_CODES } = require('../config');
const { jwtPassportMiddleware } = require('../auth/auth.strategy');
const { Employer } = require('../employee/employee.model');
const { User } = require('../user/user.model');

const EmployerJoiSchema = Joi.object().keys({
                employerName: Joi.string(),
                departments: Joi.array().items(Joi.string())
                });

// get all employers 
employerRouter.get('/', 
    jwtPassportMiddleware, 
    User.hasAccess(User.ACCESS_PUBLIC), 
    (req, res) => {
    
            return Employer
                .find()
                .then(employers => {
                    console.log(`Getting all employers`);
                    let jsonEmployers = [];
                    employers.forEach(employer => {
                    ;
                        jsonEmployers.push(employer.serializeEmp());
                    })
                    return jsonEmployers;
                    })
                    .then(jsonEmployers => {
                        return res.status(HTTP_STATUS_CODES.OK).json(jsonEmployers);

                    })
            
            .catch(err => {
                
                return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
            });
});


// get one employer by id
employerRouter.get('/:employerId', jwtPassportMiddleware, User.hasAccess(User.ACCESS_PUBLIC), (req, res) => {
    
        return Employer
                .findOne({_id: req.params.employerId})
        
        .then(employer => {
            //console.log(employer);
            console.log(`Getting new employer with id: ${req.params.employerId}`);
            return employer;
        })
        .then(jsonEmployer => {
            //console.log("JSON: " ,jsonEmployer);
            return res.status(HTTP_STATUS_CODES.OK).json(jsonEmployer);
        })
        .catch(err => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
        });
});
// create new employer
employerRouter.post('/', 
    jwtPassportMiddleware, 
    User.hasAccess(User.ACCESS_ADMIN), 
    (req, res) => {
   
    // we can access req.body payload bc we defined express.json() middleware in server.js
    const newEmployer = {
        employerName: req.body.employerName,
        departments: req.body.departments,
    }
   //console.log("NEW ",newEmployer);
    // validate newEmployer data using Joi schema
    const validation = Joi.validate(newEmployer, EmployerJoiSchema);
    if (validation.error) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }
            // attempt to create a new employer
            return Employer
            .create(newEmployer)
            
            .then(createdEmployer => {
                console.log(`Creating new employer`);
                return res.status(HTTP_STATUS_CODES.CREATED).json(createdEmployer);
            })
            .catch(err => {
                return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
            });
});

// update employer by id 
employerRouter.put('/:employerId', 
    jwtPassportMiddleware, 
    User.hasAccess(User.ACCESS_ADMIN), 
    (req, res) => {
    // check that id in request body matches id in request path
    if (req.params.employerId !== req.body.id) {
        const message = `Request path id ${req.params.employerId} and request body id ${req.body.employerId} must match`;
        console.error(message);
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
            message: message
        });
    }

    // we only support a subset of fields being updateable
    // if the user sent over any of them 
    // we update those values on the database
    const updateableFields = ["employerName", "departments"];
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

    const validation = Joi.validate(toUpdate, EmployerJoiSchema);
    if (validation.error) {
        console.log(validation.error);
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error});
    }

    Employer
    // $set operator replaces the value of a field with the specified value
        .findOneAndUpdate({_id: req.params.employerId}, { $set: toUpdate }, { new: true })
        .then(updatedEmployer => {
            console.log(`Updating employer with id: \`${req.params.employerId}\``);
            return res.status(HTTP_STATUS_CODES.OK).json(updatedEmployer);
        })
        .catch(err => { 
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
        });
});

// delete employer by id
employerRouter.delete('/:employerId', 
    jwtPassportMiddleware, 
    User.hasAccess(User.ACCESS_ADMIN), 
    (req, res) => {
    return Employer
        .findOneAndDelete({_id: req.params.employerId})
        .then(deletedEmployer => {
            console.log(`Deleting employer with id: \`${req.params.employerId}\``);
            return res.status(HTTP_STATUS_CODES.OK).json({
                deleted: `${req.params.employerId}`,
                OK: "true"
            });
        })
        .catch(err => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).res(err);
        });

});


module.exports = { employerRouter };


