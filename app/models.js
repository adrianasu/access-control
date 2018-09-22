const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const ObjectId = mongoose.Schema.Types.ObjectId;

const departmentsSchema = mongoose.Schema({
    departmentName: 
    {
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
    employerName: { type: String,
                required: true
        }
})

const employeesSchema = mongoose.Schema({
    employeeId: String,
    //photo: File,
    firstName: String,
    lastName: String,
    //employer: {type: ObjectId, ref:"Employer"},
    //department: {
    //     type: ObjectId,
    //     ref: "Department"
    // },
    licensePlates: [String],
    employmentDate: Date,
    allowVehicle: Boolean,
    // trainings: 
    // [{
    //     trainingInfo: 
    //     {
    //         type: ObjectId,
    //         ref: "Training"
    //     },
    //     trainingDate: Date
    // }]    
});

employeesSchema.methods.serialize = function() {
    return {
        id: this._id,
        employeeId: this.employeeId,
        //photo: this.photo,
        firstName: this.firstName,
        lastName: this.lastName,
        //employer: this.employer,
        //department: this.department,
        licensePlates: this.licensePlates,
        employmentDate: this.employmentDate,
        allowVehicle: this.allowVehicle,
        //trainings: this.trainings
    };
};

employeesSchema.pre('find', function(next) {
    //console.log("Populate employees");
    this.populate('department employer trainings');
    next();
});

employeesSchema.pre('findOne', function (next) {
    this.populate('department employer trainings');
    next();
});

// employeesSchema.methods.isValid = function(trainingName) {
//     let valid = false;
//     this.trainings.forEach(training => {
//         if (trainings.trainingInfo
//  && trainingName === trainings.trainingInfo
// .title) {
//             let expireDate = new Date(training.trainingInfo
//     .expirationTime.getTime() + training.date.getTime());
//             if (expireDate > Date.now()) {
//                 // training still valid
//                 valid = true;
//             }
//         }
//     });
//     return valid;
// }

const Employees = mongoose.model("Employee", employeesSchema);
const Departments = mongoose.model("Department", departmentsSchema);
const Employers = mongoose.model("Employer", employersSchema);
const Trainings = mongoose.model("Training", trainingsSchema);

module.exports = {
    Employees,
    Trainings,
    Departments,
    Employers
};


