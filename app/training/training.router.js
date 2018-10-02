const express = require('express');
const Joi = require('joi');
const trainingRouter = express.Router();

const { HTTP_STATUS_CODES } = require('../config');
const { jwtPassportMiddleware } = require('../auth/auth.strategy');
const { Training } = require('../employee/employee.model');

const TrainingJoiSchema = Joi.object().keys({
        _id: Joi.string(),
        __v: Joi.number(),
        title: Joi.string(),
        expirationTime: Joi.date()
    });

// get all trainings 
trainingRouter.get('/', 
    jwtPassportMiddleware, 
    User.hasAccess(User.ACCESS_PUBLIC), 
    (req, res) => {
    
            Training
                .find()
                .then(trainings => {
                    console.log(`Getting all trainings`);
                    let jsonTrainings = [];
                    trainings.forEach(training => {
                        jsonTrainings.push(training);
                    })
                    return jsonTrainings;
                })
                .then(jsonTrainings => {
                    return res.status(HTTP_STATUS_CODES.OK).json(jsonTrainings)
                })
            
            .catch(err => {
                
                return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
            });
});


// get one training by id
trainingRouter.get('/:trainingId', jwtPassportMiddleware, User.hasAccess(User.ACCESS_PUBLIC), (req, res) => {
    
            return Training
                .findOne({trainingId: req.params.trainingId})
        
        .then(training => {
            //console.log(training);
            console.log(`Getting new training with id: ${req.params.trainingId}`);
            return training;
        })
        .then(jsonTraining => {
            //console.log(jsonTraining);
            return res.status(HTTP_STATUS_CODES.OK).json(jsonTraining);
        })
        .catch(err => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
        });
});
// create new training
trainingRouter.post('/', 
    jwtPassportMiddleware, 
    User.hasAccess(User.ACCESS_ADMIN), 
    (req, res) => {
   
    // we can access req.body payload bc we defined express.json() middleware in server.js
    const newTraining = { TrainingInfo: 
        {
        title: req.body.title,
        expirationTime: req.body.expirationTime,
        }
    }
   
    // validate newtraining data using Joi schema
    const validation = Joi.validate(newtraining, TrainingJoiSchema);
    if (validation.error) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }
            // attempt to create a new training
            return Training
            .create(newTraining)
            
            .then(createdTraining => {
                console.log(`Creating new training`);
                return res.status(HTTP_STATUS_CODES.CREATED).json(createdTraining);
            })
            .catch(err => {
                return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
            });
});

// update training by id 
trainingRouter.put('/:trainingId', 
    jwtPassportMiddleware, 
    User.hasAccess(User.ACCESS_ADMIN), 
    (req, res) => {
    // check that id in request body matches id in request path
    if (req.params.trainingId !== req.body.trainingId) {
        const message = `Request path id ${req.params.trainingId} and request body id ${req.body.trainingId} must match`;
        console.error(message);
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
            message: message
        });
    }

    // we only support a subset of fields being updateable
    // if the user sent over any of them 
    // we update those values on the database
    const updateableFields = ["title", "expirationTime"];
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

    const validation = Joi.validate(toUpdate, TrainingJoiSchema);
    if (validation.error) {
        console.log(validation.error);
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error});
    }

    Training
    // $set operator replaces the value of a field with the specified value
        .findOneAndUpdate({trainingId: req.params.trainingId}, { $set: toUpdate }, { new: true })
        .then(updatedTraining => {
            console.log(`Updating training with id: \`${req.params.trainingId}\``);
            return res.status(HTTP_STATUS_CODES.OK).json(updatedTraining);
        })
        .catch(err => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
        });
});

// delete training by id
trainingRouter.delete('/:trainingId', 
    jwtPassportMiddleware, 
    User.hasAccess(User.ACCESS_ADMIN), 
    (req, res) => {
    return Training
        .findOneAndDelete({trainingId: req.params.trainingId})
        .then(deletedTraining => {
            console.log(`Deleting training with id: \`${req.params.trainingId}\``);
            res.status(HTTP_STATUS_CODES.OK).json({
                deleted: `${req.params.trainingId}`,
                OK: "true"
            });
        })
        .catch(err => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).res(err);
        });

});


module.exports = { employeeRouter };


