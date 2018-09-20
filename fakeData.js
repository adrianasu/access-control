const faker = require('faker');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { Employees, Departments, Trainings, Employers } = require('./models');

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
        departments.push({departmentName:faker.name.jobArea()});
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

function randomFromarray(arr){
    if( arr && arr.length )
        return arr[Math.floor(Math.random() * arr.length)];
}

function generateEmployeeData(employers, departments, trainingTypes) {
    const randomEmployer = randomFromArray(employers);
    const randomDepartment = randomFromArray(departments);
    const randomTraining1 = randomFromArray(trainings);
    const randomTraining2 = randomFromArray(trainings);
    const randomTraining3 = randomFromArray(trainings);
    console.log(JSON.stringify({
        randomEmployer,
        randomDepartment,
        randomTraining1,
        randomTraining2,
        randomTraining3        
    }));

    return {
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
            trainingType: training1,
            date: faker.date.recent(300)
            },
        {
            trainingType: training2,
            date: faker.date.recent(366)
        },
        {
            trainingType: randomTraining3,
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

    console.log('Trying to insert Departments:', departments);
    return Departments.insertMany(departments)
    .then(departmentIds => {

        console.log('Made new departments', departmentIds);

        return Trainings.insertMany(trainings)
        .catch(console.error)
        .then(trainingIds => {

            console.log('Made new trainings', trainingIds);

            return Employers.insertMany(employers,)
            .catch(console.error)
            .then(employerIds => {
                
                console.log('Made new employers', employerIds);


                for (let x = 1; x <= 10; x++) {
                    const newEmployeeData = generateEmployeeData(employerIds, departmentIds, trainingIds);
                    console.log("Generated new employee data:", newEmployeeData);
                    seedEmployees.push(newEmployeeData);
                }

                console.log(seedEmployees);
                return Employees.insertMany(seedEmployees)
                .then(employee => {
                    console.log(employee);
                    return employee;
                })
                    .catch(console.error);
    
            })
       
        })

    })
    .catch(err => {
        console.log("Error inserting departments");
        console.error(err);
    });

} 

module.exports = { 
    generateDepartments, 
    generateEmployers, 
    generateTrainingList, 
    generateEmployeeData,
    seedEmployeesData
 }