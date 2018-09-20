const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//const ObjectId = mongoose.Schema.Types.ObjectId;

const departmentsSchema = mongoose.Schema({
    name: {
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
    departments: [String],
    name: { type: String,
            required: true}
})

const employeesSchema = mongoose.Schema({
    employeeId: String,
    //photo: File,
    firstName: String,
    lastName: String,
    employer: {type: Map, ref: "Employers"},
    department: String,
    licensePlates: [String],
    employmentDate: Date,
    allowVehicle: Boolean,
    trainings: 
    [{
        trainingType: 
        {
            type: Map,
            ref: "Trainings"
        },
        date: Date
    }]    
});

employeesSchema.methods.serialize = function() {
    return {
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

employeesSchema.pre('find', function(next) {
    this.populate('Employers');
    this.populate('Departments');
    this.populate('Trainings');
    next();
});

employeesSchema.pre('findOne', function (next) {
    this.populate('Employers');
    this.populate('Departments');
    this.populate('Trainings');
    next();
});

employeesSchema.methods.isValid = function(trainingName) {
    let valid = false;
    this.trainings.forEach(training => {
        if (training.trainingType && trainingName === training.trainingType.title) {
            let expireDate = new Date(training.trainingType.expirationTime.getTime() + training.date.getTime());
            if (expireDate > Date.now()) {
                // training still valid
                valid = true;
            }
        }
    });
    return valid;
}

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


