const faker = require('faker');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { User } = require('../app/user/user.model');
const { Employee, Department, Training, Employer } = require('../app/employee/employee.model');


function generateEmployerNames() {
    let employers = [];
    for (let x = 0; x < 5; x++) {
        employers.push(faker.company.companyName());
    }
    return employers;
}

function generateEmployers(departmentIds, employerName) {
    let employer = [];
    for (let i= 0; i < 5; i++) {
        employer.push({
            departments: [randomFromArray(departmentIds)],
            employerName: employerName[i]
        })
    }
    return employer;
}

function generateDepartments() {
    let departments = [];
    for (let x = 0; x < 5; x++) {
        departments.push({departmentName: faker.name.jobArea()});
    }
    return departments;    
}

function generateTrainingList() {
    let trainings = [];
    for (let x = 0; x < 4; x++) {
        trainings.push({title: faker.lorem.sentence(),
            expirationTime: new Date(1000*60*60*24*365)});
    }
    return trainings;
}

function randomFromArray(arr){
    if( arr && arr.length )
        return arr[Math.floor(Math.random() * arr.length)];
}

function generateEmployeeData(employerIds, departmentIds, trainingIds, userIds) {
      
    return {
        employeeId: faker.random.number(6),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        employer: randomFromArray(employerIds),
        department: randomFromArray(departmentIds),
        licensePlates: [faker.random.alphaNumeric(7), faker.random.alphaNumeric(7)],
        employmentDate: faker.date.past(),
        allowVehicle: faker.random.boolean(),
        trainings: [{
            trainingInfo: randomFromArray(trainingIds),
            trainingDate: faker.date.recent(300)
            },
        {
            trainingInfo: randomFromArray(trainingIds),
            trainingDate: faker.date.recent(366)
        },
        {
            trainingInfo: randomFromArray(trainingIds),
            trainingDate: faker.date.recent(300)
        }]
    }
}

function createUpdatedFields(employer, department) {
    return {
        lastName: "NewLastName",
        employer: employer,
        department: department,
        licensePlates: ["123NEW45"],
        employmentDate: new Date(2000, 3, 2),
        allowVehicle: false,
        trainings: [{
                trainingInfo: Training[0],
                trainingDate: new Date()
            },
            {
                trainingInfo: Training[1],
                trainingDate: new Date()
            },
            {
                trainingInfo: Training[2],
                trainingDate: new Date()
            }
        ]
    }
}

function findOne(collectionName) {
    return collectionName
        .findOne()
        .then(function (document) {
            return document;
        })
}

function generateFieldsToUpdate() {
    let employer;
    return findOne(Employer)
        .then(_employer => {
            employer = _employer;
            return findOne(Department)
        })
        .then(department => {
            return createUpdatedFields(employer, department);
        })
}

function generateEmployees(employerIds, departmentIds, trainingIds) {
    let seedEmployees = [];
    for (let x = 1; x <= 10; x++) {
        const newEmployeeData = generateEmployeeData(employerIds, departmentIds, trainingIds, User);
        seedEmployees.push(newEmployeeData);
    }
    return seedEmployees;
}

function generateOneEmployer() {
    return Department.findOne()
        .then(department => {            
           return {
                employerName: faker.company.companyName(),
                departments: [department._id]
            }
        })
}

function generateOneEmployee() {
    let employer, department, training, user;
        
    return Employer.find()
        .then(_employer => {
            employer = _employer;
            return Department.find();
        })
        .then(_department => {
            department = _department;
            return Training.find();
        })
        .then(_training => {
            training = _training;
            
            return User.findOne();
        })
        .then(_user => {
            _user = user;
        
            return generateEmployeeData(employer, department, training, user);
        }) 
}

function seedEmployeesData() {
    let departments = generateDepartments();
    let employerName = generateEmployerNames();
    let trainings = generateTrainingList();

    let employerIds, departmentIds;
 
            console.log('Generating new departments');
            return Department.insertMany(departments)

        .then(_departmentIds => {
            departmentIds = _departmentIds;
            console.log('Generating new employers');
            return Employer.insertMany(generateEmployers(departmentIds, employerName));
        })
        .then(_employerIds => { 
            employerIds = _employerIds;
            console.log('Generating new trainings');
            return Training.insertMany(trainings);
        })
        .then(trainingIds => {
            console.log("Generating new employee data");
            return Employee
                .insertMany(generateEmployees(employerIds, departmentIds, trainingIds));
            })   
        .catch(err => console.log("error", err));
} 

module.exports = { 
    seedEmployeesData, generateOneEmployee, generateFieldsToUpdate, generateOneEmployer
 }