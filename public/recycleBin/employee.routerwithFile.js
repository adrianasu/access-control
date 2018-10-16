const express = require('express');
const Joi = require('joi');
const employeeRouter = express.Router();
// middleware for handling multi-part data
const multer = require('multer');
const fs = require('fs');
// const GridFsStorage = require('multer-gridfs-storage');
// const crypto = require('crypto');
// const path = require('path');
const mongoose = require('mongoose');


const { HTTP_STATUS_CODES } = require('../../app/config');
const { jwtPassportMiddleware } = require('../../app/auth/auth.strategy');
const { Employee, EmployeeJoiSchema, UpdateEmployeeJoiSchema, Training, Photo } = require('../../app/employee/employee.model');
const User = require('../../app/user/user.model');
const mongoUrl  = require('../../app/server');

// // Init gfs
// let gfs;

// conn.once('open', () => {
//     // Init stream
    
//     gfs.collection('photos');
// });

// GridFS storage engine for multer to store files to MongoDB
const storage = new GridFsStorage({
    url: mongoUrl,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if(err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'photos'  //match the collection name
                };
                resolve(fileInfo);
            });
        });
    }
});

// to save image only jpeg/png in our storage
const fileFilter = (req, file, callback) => {
    if(file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png'){
        callback(null, true);
    } 
    else{
        callback(null, false);
    }
}

const upload = multer({ 
    storage, 
    // limits: {fileSize: 1024*1024*5},
    // fileFilter: fileFilter,
});


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
    //upload.single('photo'),
    (req, res) => {
       
        console.log(req);
       
        // we can access req.body payload bc we defined express.json() middleware in server.js
        const newEmployee = {
            employeeId: req.body.employeeId,
            photo: req.file,
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

// get all employees 
employeeRouter.get('/', jwtPassportMiddleware, User.hasAccess(User.ACCESS_PUBLIC), 
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
                        jsonEmployees.push(employee.serialize());
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

// get overview employee by id
employeeRouter.get('/overview/:employeeId', jwtPassportMiddleware, User.hasAccess(User.ACCESS_OVERVIEW_ONLY), 
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
                return employee.serializeOverview(validateEmployeeTrainings(employee, trainings));
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


// update employee by id 
employeeRouter.put('/:employeeId', jwtPassportMiddleware, User.hasAccess(User.ACCESS_ADMIN), 
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
employeeRouter.delete('/:employeeId', jwtPassportMiddleware, User.hasAccess(User.ACCESS_ADMIN), 
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


