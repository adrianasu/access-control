const faker = require('faker');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { Employees } = require('./models');

function generateEmployers() {
    let employers = [];
    for (let x = 0; x < 3; x++) {
        employers.push(faker.company.companyName());
    }
    return employers;
}

function generateDepartments() {
    let departments = [];
    for (let x = 0; x < 3; x++) {
        departments.push(faker.name.jobArea());
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

function generateEmployeeData(employers, departments, trainingTypes) {
    return {
        employeeId: faker.lorem.words(1),
        //photo: 
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        employer: {
                    departments: departments,
                    name: employers[Math.floor(Math.random() * employers.length)]
        },
        department: departments[Math.floor(Math.random() * departments.length)],
        employmentDate: faker.date.past(),
        allowVehicle: faker.random.boolean(),
        licensePlates: [faker.random.alphaNumeric(7), faker.random.alphaNumeric(7)],
        trainings: [{
            trainingType: trainingTypes[Math.floor(Math.random() * trainingTypes.length)],
            date: faker.date.recent(300)
            },
        {
            trainingType: trainingTypes[Math.floor(Math.random() * trainingTypes.length)],
            date: faker.date.recent(366)
        },
        {
        trainingType: trainingTypes[Math.floor(Math.random() * trainingTypes.length)],
        date: faker.date.recent(300)
        }]
    }
}

function seedEmployeesData() {
    console.info('Seeding employees data');
    const seedEmployees = [];
    let departments = generateDepartments();
    let employers = generateEmployers();
    let trainings = generateTrainingList();
    for (let x = 1; x <= 10; x++) {
        seedEmployees.push(generateEmployeeData(employers, departments, trainings));
    }
    console.log(seedEmployees);
    return Employees.insertMany(seedEmployees)
    .then(employee => {
        console.log(employee);
        return employee;
    })
        .catch(console.error);
} 

module.exports = { 
    generateDepartments, 
    generateEmployers, 
    generateTrainingList, 
    generateEmployeeData,
    seedEmployeesData
 }