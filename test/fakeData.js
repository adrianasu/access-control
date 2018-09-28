const faker = require('faker');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { User } = require('../app/user/user.model');
const { Employee, Department, Training, Employer } = require('../app/employee/employee.model');

function generateEmployerNames() {
    let employers = [];
    for (let x = 0; x < 3; x++) {
        employers.push(faker.company.companyName());
    }
    return employers;
}

function generateEmployers(departmentIds, employerName) {
    let employer = [];
    for (let i= 0; i < 3; i++) {
        employer.push({
            departments: [randomFromArray(departmentIds)],
            employerName: employerName[i]
        })
    }
    return employer;
}

function generateDepartments() {
    let departments = [];
    for (let x = 0; x < 3; x++) {
        departments.push({departmentName: faker.name.jobArea()});
    }
    return departments;    
}

function generateTrainingList() {
    let trainings = [];
    for (let x = 0; x < 3; x++) {
        trainings.push({title: faker.lorem.sentence(),
            expirationTime: new Date(1000*60*60*24*365)});
    }
    return trainings;
}

function randomFromArray(arr){
    if( arr && arr.length )
        return arr[Math.floor(Math.random() * arr.length)];
}

function generateEmployeeData(employerIds, departmentIds, trainingIds, User) {
    return {
        updatedBy: [User.findOne()._id],
        employeeId: faker.lorem.words(1),
        //photo: 
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        employer: randomFromArray(employerIds),
        department: randomFromArray(departmentIds),
        employmentDate: faker.date.past(),
        allowVehicle: faker.random.boolean(),
        licensePlates: [faker.random.alphaNumeric(7), faker.random.alphaNumeric(7)],
        trainings: [{
            trainingInfo: randomFromArray(trainingIds),
            trainingDate: faker.date.recent(300)
            },
        {
            trainingInfo: randomFromArray(Training),
            trainingDate: faker.date.recent(366)
        },
        {
            trainingInfo: randomFromArray(Training),
            trainingDate: faker.date.recent(300)
        }]
    }
}

function generateEmployees(employerIds, departmentIds, trainingIds) {
    let seedEmployees = [];
    for (let x = 1; x <= 10; x++) {
        const newEmployeeData = generateEmployeeData(employerIds, departmentIds, trainingIds, User);
        seedEmployees.push(newEmployeeData);
    }
    return seedEmployees;
}

function seedEmployeesData() {
    let departments = generateDepartments();
    let employerName = generateEmployerNames();
    let trainings = generateTrainingList();
    let employerIds, departmentIds;
 
    return Department.insertMany(departments)
    .then(_departmentIds => {
        departmentIds = _departmentIds;
        console.log('Generated new departments');
        return generateEmployers(departmentIds, employerName)       
    })
    .then(employers => {
        return Employer.insertMany(employers)
    })
    .then(_employerIds => { 
        employerIds = _employerIds;
        console.log('Generated new employers');
        return Training.insertMany(trainings)
    })
    .then(trainingIds => {
        console.log('Generated new trainings');
        return generateEmployees(employerIds, departmentIds, trainingIds)
    })
    .then(employees => {
        console.log("Generated new employee data");
        return Employee.insertMany(employees)
    })   
    // .then(employeeIds => {
    //     console.log("Sent all data to DB");
    //     return employeeIds;
    // })
    //.catch(console.error("Internal server error fakeData"));
} 

module.exports = { 
    seedEmployeesData
 }