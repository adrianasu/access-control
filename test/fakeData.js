const faker = require('faker');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { Users } = require('../app/user/user.model');
const { Employees, Departments, Trainings, Employers } = require('../app/employee/employee.model');
const { generateUserAndToken } = require('./fakeUser');

function generateEmployerNames() {
    let employers = [];
    for (let x = 0; x < 3; x++) {
        employers.push(faker.company.companyName());
    }
    return employers;
}

function generateEmployers(Departments, employerName) {
    let employer = [];
    for (let i= 0; i < 3; i++) {
        employer.push({
            departments: [Departments.findOne()._id],
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

function generateEmployeeData(employers, Departments, Trainings, Users) {
    const randomEmployer = randomFromArray(employers);
    const randomDepartment = randomFromArray(Departments);
    const randomTraining1 = randomFromArray(Trainings);
    const randomTraining2 = randomFromArray(Trainings);
    const randomTraining3 = randomFromArray(Trainings);

    return {
        updatedBy: [Users.findOne()._id],
        employeeId: faker.lorem.words(1),
        //photo: 
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        employer: randomEmployer,
        department: randomDepartment,
        employmentDate: faker.date.past(),
        allowVehicle: faker.random.boolean(),
        licensePlates: [faker.random.alphaNumeric(7), faker.random.alphaNumeric(7)],
        trainings: [{
            trainingInfo: randomTraining1,
            trainingDate: faker.date.recent(300)
            },
        {
            trainingInfo: randomTraining2,
            trainingDate: faker.date.recent(366)
        },
        {
            trainingInfo: randomTraining3,
            trainingDate: faker.date.recent(300)
        }]
    }
}

function generateEmployees(employer, Departments, Trainings) {
    let seedEmployees = [];
    for (let x = 1; x <= 10; x++) {
        const newEmployeeData = generateEmployeeData(employer, Departments, Trainings, Users);
        seedEmployees.push(newEmployeeData);
    }
    return seedEmployees;
}

function seedEmployeesData() {
    const seedEmployees = [];
    let departments = generateDepartments();
    let employerName = generateEmployerNames();
    let trainings = generateTrainingList();
 
    return Departments.insertMany(departments)
    .then(departmentIds => {
        console.log('Generated new departments');
        return Trainings.insertMany(trainings)
    })
    .then(trainingIds => {
        console.log('Generated new trainings');
        return generateEmployers(Departments, employerName)       
    })
    .then(employers => { 
        return Employers.insertMany(employers)
    })
    .then(employer => {
        console.log('Generated new employers');
        return generateEmployees(employer, Departments, Trainings)
    })
    .then(employees => {
        console.log("Generated new employee data:");
        return Employees.insertMany(employees)
    })
        
    .then(employee => {
        console.log("Sent all data to DB");
        return employee;
    })
    .catch(console.error("Internal server error"));
} 

module.exports = { 
    generateDepartments, 
    generateEmployerNames, 
    generateTrainingList, 
    generateEmployeeData,
    seedEmployeesData
 }