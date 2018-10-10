const express = require('express');
const Joi = require('joi');
const trainingRouter = express.Router();

const { HTTP_STATUS_CODES } = require('../config');
const { jwtPassportMiddleware } = require('../auth/auth.strategy');
const { Training } = require('../employee/employee.model');
const User  = require('../user/user.model');

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
    
            return Training
                .find()
                .then(trainings => {
                    console.log(`Getting all trainings`);
                    let jsonTrainings = [];
                    trainings.forEach(training => {
                        console.log(training);
                        jsonTrainings.push(training.serializeTr());
                    })
                    return jsonTrainings;
                })
                .then(jsonTrainings => {
                    return res.status(HTTP_STATUS_CODES.OK).json(jsonTrainings);

                })
            
            .catch(err => {
                return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
            });
});

// get one training by id
trainingRouter.get('/:trainingId', jwtPassportMiddleware, User.hasAccess(User.ACCESS_PUBLIC), (req, res) => {
    
    return Training
        .findOne({_id: req.params.trainingId})
        
        .then(training => {
            console.log(`Getting new training with id: ${req.params.trainingId}`);
            return res.status(HTTP_STATUS_CODES.OK).json(training);
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
    const newTraining = {
        title: req.body.title,
        expirationTime: req.body.expirationTime
    }
   
    // validate newTraining data using Joi schema
    const validation = Joi.validate(newTraining, TrainingJoiSchema);
    if (validation.error) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }
    // attempt to create a new Training
     return Training
        .create(newTraining)
        .then(createdTraining => {
            console.log(`Creating new Training`);
            return res.status(HTTP_STATUS_CODES.CREATED).json(createdTraining);
        })
        .catch(err => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
        });
});


// update training's by id
trainingRouter.put('/:trainingId', jwtPassportMiddleware,
    User.hasAccess(User.ACCESS_ADMIN),
    (req, res) => {
        // check that id in request body matches id in request path
        if (req.params.trainingId !== req.body.id) {
            const message = `Request path id ${req.params.trainingId} and request body id ${req.body.id} must match`;
            console.log(message);
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: message
            });
        }

        const updateableFields = ["title", "expirationTime"];
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
                message: message
            });
        }

        const validation = Joi.validate(toUpdate, TrainingJoiSchema);

        if (validation.error) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                error: validation.error
            });
        }


       return Training
            // $set operator replaces the value of a field with the specified value
            .findByIdAndUpdate(req.params.trainingId, {
                $set: toUpdate
            }, {
                new: true
            })
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


module.exports = { trainingRouter };


