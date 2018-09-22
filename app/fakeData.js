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

function generateEmployeeData(employers, departments, trainingList) {
    const randomEmployer = randomFromArray(employers);
    const randomDepartment = randomFromArray(departments);
    const randomTraining1 = randomFromArray(trainingList);
    const randomTraining2 = randomFromArray(trainingList);
    const randomTraining3 = randomFromArray(trainingList);
    // console.log(JSON.stringify({
    //     randomEmployer,
    //     randomDepartment,
    //     randomTraining1,
    //     randomTraining2,
    //     randomTraining3        
    // }));

    return {
        employeeId: faker.lorem.words(1),
        //photo: 
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        //employer: randomEmployer,
        //department: randomDepartment,
        employmentDate: faker.date.past(),
        allowVehicle: faker.random.boolean(),
        licensePlates: [faker.random.alphaNumeric(7), faker.random.alphaNumeric(7)],
        // trainings: [{
        //     trainingInfo: randomTraining1,
        //     trainingDate: faker.date.recent(300)
        //     },
        // {
        //     trainingInfo: randomTraining2,
        //     trainingDate: faker.date.recent(366)
        // },
        // {
        //     trainingInfo: randomTraining3,
        //     trainingDate: faker.date.recent(300)
        // }]
    }
}

function seedEmployeesData() {
    console.info('Seeding employees data');
    const seedEmployees = [];
    let departments = generateDepartments();
    let employerName = generateEmployers();
    let trainings = generateTrainingList();
    //console.log(employerName);
   

    console.log('Trying to insert Departments:');
    return Departments.insertMany(departments)
    .then(departmentIds => {

        console.log('Made new departments');

        return Trainings.insertMany(trainings)
        .catch(console.error)
        .then(trainingIds => {

            console.log('Made new trainings');

             let employers = [{
                     departments: [departmentIds[0]._id, 
                         departmentIds[1]._id
                     ],
                     employerName: employerName[0]
                 },
                 {
                     departments: [departmentIds[1]._id],
                     employerName: employerName[1]
                 },
                 {
                     departments: [departmentIds[2]._id],
                     employerName: employerName[2]
                 }

             ]

            return Employers.insertMany(employers)
            .catch(console.error)
            .then(employer => {
                
                console.log('Made new employers');


                for (let x = 1; x <= 10; x++) {
                    const newEmployeeData = generateEmployeeData(employer, departmentIds, trainingIds);
                    seedEmployees.push(newEmployeeData);
                }
                console.log("Generated new employee data:");
                //console.log(seedEmployees);
                return Employees.insertMany(seedEmployees)
                .then(employee => {
                    console.log("Sent data to DB");
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