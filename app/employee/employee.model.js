const mongoose = require('mongoose');
const Joi = require('joi');

mongoose.Promise = global.Promise;
const ObjectId = mongoose.Schema.Types.ObjectId;

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
        ref: "department"
    }],
    employerName: {
        type: String,
        required: true
    }
})

const employeesSchema = mongoose.Schema({
    updatedBy: [{ 
                type: ObjectId,
                ref: "user"
            }],
    employeeId: String,
    //photo: File,
    firstName: String,
    lastName: String,
    employer: {type: ObjectId, ref:"employer"},
    department: {
        type: ObjectId,
        ref: "department"
    },
    licensePlates: [String],
    employmentDate: Date,
    allowVehicle: Boolean,
    trainings: 
    [{
        trainingInfo: 
        {
            type: ObjectId,
            ref: "training"
        },
        trainingDate: Date
    }]    
});

employeesSchema.methods.serialize = function () {
    return {
        updatedBy: this.user.serialize(),
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
        trainings: this.trainings
    };
};

// validate data 
const EmployeesJoiSchema = Joi.object().keys({
    updatedBy: Joi.string().optional(),
    employeeId: Joi.string().required(),
    //photo: this.photo,
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    employer: Joi.object().keys({ 
        employerName: Joi.string().required(),
        departments: Joi.array().items(Joi.string())}),
    department: Joi.object().keys({departmentName: Joi.string()}),
    licensePlates: Joi.array().items(Joi.string()),
    employmentDate: Joi.date(),
    allowVehicle: Joi.boolean(),
    trainings: Joi.array().items(
                Joi.object().keys({
                    trainingInfo: Joi.object().keys({
                        title: Joi.string(), 
                        expirationTime: Joi.date()}), 
                    trainingDate: Joi.date()
                    })
                ), 
})


// employeesSchema.pre('find', function (next) {
//     //console.log("Populate employees");
//     this.populate('department employer trainings');
//     next();
// });

// employeesSchema.pre('findOne', function (next) {
//     this.populate('department employer trainings');
//     next();
// });

employeesSchema.methods.isValid = function(trainingName) {
    let valid = false;
    this.trainings.forEach(training => {
        if (trainings.trainingInfo
 && trainingName === trainings.trainingInfo.title) {
            let expireDate = new Date(training.trainingInfo
    .expirationTime.getTime() + training.date.getTime());
            if (expireDate > Date.now()) {
                // training still valid
                valid = true;
            }
        }
    });
    return valid;
}

const Employees = mongoose.model("employee", employeesSchema);
const Departments = mongoose.model("department", departmentsSchema);
const Employers = mongoose.model("employer", employersSchema);
const Trainings = mongoose.model("training", trainingsSchema);

module.exports = {
    Employees,
    Trainings,
    Departments,
    Employers,
    EmployeesJoiSchema
};
