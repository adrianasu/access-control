const mongoose = require('mongoose');
const Joi = require('joi');

// instantiate mongoose-gridfs
// const gridfs = require('mongoose-gridfs')({
//     collection: 'photos',
//     model: 'Photo'
// })

mongoose.Promise = global.Promise;
const ObjectId = mongoose.Schema.Types.ObjectId;

// const photoSchema = gridfs.schema;

const departmentsSchema = mongoose.Schema({
    departmentName: {
        type: String,
        required: true,
        unique: true
    }
})

const trainingsSchema = mongoose.Schema({
    title: String,
    expirationTime: {
        type: Date,
        default: null
    }
})

const employersSchema = mongoose.Schema({
    departments: [{
        type: ObjectId,
        ref: "Department"
    }],
    employerName: {
        type: String,
        required: true
    }
})

const employeesSchema = mongoose.Schema({
    //updatedBy: [{ 
        //     type: ObjectId,
        //     ref: "User"
        // }],
        employeeId: String,
        //photo: { type: ObjectId, ref: "Photo"},
        firstName: String,
        lastName: String,
        employer: {type: ObjectId, ref:"Employer"},
        department: {
            type: ObjectId,
            ref: "Department"
        },
        licensePlates: [String],
        employmentDate: Date,
        allowVehicle: Boolean,
        trainings: 
        [{
            trainingInfo: 
            {
            type: ObjectId,
            ref: "Training"
        },
        trainingDate: Date
    }]    
});

employeesSchema.methods.serialize = function(ready2work) {
    return {
        //updatedBy: this.user.serialize(),
        id: this._id,
        employeeId: this.employeeId,
        //photo: this.photo,
        firstName: this.firstName,
        lastName: this.lastName,
        employer: this.employer,
        department: this.department,
        licensePlates: this.licensePlates,
        employmentDate: this.employmentDate,
        allowVehicle: this.allowVehicle,
        trainings: this.trainings,
        ready2work: ready2work
    };
};

employeesSchema.methods.serializeOverview = function(ready2work) {
    return {
        employeeId: this.employeeId,
        //photo: this.photo,
        firstName: this.firstName,
        lastName: this.lastName,
        employer: this.employer,
        department: this.department,
        licensePlates: this.licensePlates,
        allowVehicle: this.allowVehicle,
        trainings: this.trainings,
        ready2work: ready2work
    };
}

// validate data 
const EmployeeJoiSchema = Joi.object().keys({
    // updatedBy: Joi.string().optional(),
    employeeId: Joi.string().required(),
    //photo: this.photo,
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    employer: Joi.object().keys({ 
        _id: Joi.string(),
        __v: Joi.number(),
        employerName: Joi.string(),
        departments: Joi.array().items(Joi.object().keys({
            _id: Joi.string(),
            __v: Joi.number(),
            departmentName: Joi.string()
        }))
    }),
    department: Joi.object().keys({
        _id: Joi.string(),
        __v: Joi.number(),
        departmentName: Joi.string()}),
        licensePlates: Joi.array().items(Joi.string()),
        employmentDate: Joi.date(),
        allowVehicle: Joi.boolean(),
        trainings: Joi.array().items(
            Joi.object().keys({
                trainingInfo: Joi.object().keys({
                    _id: Joi.string(),
                    __v: Joi.number(),
                    title: Joi.string(), 
                    expirationTime: Joi.date()}), 
                    trainingDate: Joi.date()
                })
                ), 
            })
            
const UpdateEmployeeJoiSchema = Joi.object().keys({
    //updatedBy: Joi.string().optional(),
    employeeId: Joi.string(),
    //photo: this.photo,
    firstName: Joi.string(),
    lastName: Joi.string(),
    employer: Joi.object().keys({
        _id: Joi.string(),
        __v: Joi.number(),
        employerName: Joi.string(),
        departments: Joi.array().items(Joi.object().keys({
            _id: Joi.string(),
            __v: Joi.number(),
            departmentName: Joi.string()
        }))
    }),
    department: Joi.object().keys({
        _id: Joi.string(),
        __v: Joi.number(),
        departmentName: Joi.string()
    }),
    licensePlates: Joi.array().items(Joi.string()),
    employmentDate: Joi.date(),
    allowVehicle: Joi.boolean(),
    trainings: Joi.array().items(
        Joi.object().keys({
            trainingInfo: Joi.object().keys({
                _id: Joi.string(),
                __v: Joi.number(),
                title: Joi.string(),
                expirationTime: Joi.date()
            }),
            trainingDate: Joi.date()
        })
        ),
    })

const EmployerJoiSchema = Joi.object().keys({
    //employer: Joi.object().keys({
            _id: Joi.string(),
            __v: Joi.number(),
            employerName: Joi.string(),
            departments: Joi.array().items(Joi.object().keys({
                _id: Joi.string(),
                __v: Joi.number(),
                departmentName: Joi.string()
            }))
             // })
});

const DepartmentJoiSchema = Joi.object().keys({
        department: Joi.object().keys({
            _id: Joi.string(),
            __v: Joi.number(),
            departmentName: Joi.string()
        })
});
     
const TrainingJoiSchema = Joi.object().keys({
    trainings: Joi.array().items(
        Joi.object().keys({
                trainingInfo: Joi.object().keys({
                    _id: Joi.string(),
                    __v: Joi.number(),
                    title: Joi.string(),
                    expirationTime: Joi.date()
                })
        })
    )
});
    
    employersSchema.pre('find', function (next) {
        this.populate('departments');
        next();
    });
    
    employersSchema.pre('findOne', function (next) {
        this.populate('departments');
        next();
    });
    
    employeesSchema.pre('find', function (next) {
        this.populate('department employer trainings.trainingInfo user')
        next();
    });
    
    employeesSchema.pre('findOne', function (next) {
        this.populate('department employer trainings.trainingInfo user')
        next();
    });
    
    // instance method to determine if a training is valid or expired
    employeesSchema.methods.isValid = function(trainingName) {
        let valid = false;
        this.trainings.forEach(training => {
            if (training.trainingInfo
                && trainingName === training.trainingInfo.title) {
                    let expireDate = new Date(training.trainingInfo
                        .expirationTime.getTime() + training.trainingDate.getTime());
                        if (expireDate > Date.now()) {
                            // training still valid
                            valid = true;
                        }
                    }
                });
                return valid;
            }
            
            // const Photo = gridfs.model;
            // const Photo = mongoose.model("Photo", photoSchema);
            const Employee = mongoose.model("Employee", employeesSchema);
            const Department = mongoose.model("Department", departmentsSchema);
            const Employer = mongoose.model("Employer", employersSchema);
            const Training = mongoose.model("Training", trainingsSchema);
            
            module.exports = {
                //Photo,
                Employee,
                Training,
                Department,
                Employer,
                EmployeeJoiSchema,
                UpdateEmployeeJoiSchema,
                EmployerJoiSchema,
                DepartmentJoiSchema,
                TrainingJoiSchema
            };
            