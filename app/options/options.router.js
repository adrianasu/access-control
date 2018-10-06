const express = require('express');
const optionsRouter = express.Router();

const {
    HTTP_STATUS_CODES
} = require('../config');
const {
    jwtPassportMiddleware
} = require('../auth/auth.strategy');
const {
    Department, Employer, Training
} = require('../employee/employee.model');
const User = require('../user/user.model');


// get all departments, employers and trainings 
optionsRouter.get('/',
    jwtPassportMiddleware,
    User.hasAccess(User.ACCESS_PUBLIC),
    (req, res) => {

    return Department
        .find()
        .then(departments => {
            console.log(`Getting all departments`);
            return Employer
                .find()
                .then(employers => {
                    console.log(`Getting all employers`);
                    return Training
                        .find()
                        .then(trainings => {
                            console.log(`Getting all trainings`);
                            let options = {
                                departments: departments,
                                employers: employers,
                                trainings: trainings
                            }
                            return res.status(HTTP_STATUS_CODES.OK).json(options)
                            })
                    })
            })
            .catch(err => {
                return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
            });

});

module.exports = { optionsRouter };