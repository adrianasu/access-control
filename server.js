//require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();

const {
    DATABASE_URL,
    PORT
} = require("./config");

mongoose.Promise = global.Promise;

// use express' static middleware function to serve our 
// static file inside 'public' folder
app.use(express.static('public'));
app.use(morgan('common'));

const { Employees } = require('./models');

// GET all employees 
app.get('/list', (req, res) => {
    return Employees
        .find()
        .then(employees => {
            console.log('Sending response from GET request');
            res.status(200).json(
                employees.map(employee => {
                    return {
                        employeeId: employee.id,
                        //photo: employee.photo,
                        firstName: employee.firstName,
                        lastName: employee.lastName,
                        employer: employee.employer,
                        department: employee.department,
                        licensePlates: employee.licensePlates,
                        employmentDate: employee.employmentDate,
                        allowVehicle: employee.allowVehicle,
                        trainings: employee.trainings
                    }
                })
            )
        })
        .catch(err => {
            console.error('GET employees error');
            res.status(500).json({
                message: "Internal server error"
            });
        });
});


// GET request by id returns employee's overview
app.get("entrance/:id", (req, res) => {
    return Employees
            .findById(req.params.id)
            .then(employee => {
                console.log(`Sending response from GET request employee's overview by id`);
                Other
                    .find()
                    .then(item =>{
                        res.json({
                            employeeData: {
                                id: employee.id,
                                photo: employee.photo,
                                firstName: employee.firstName,
                                lastName: employee.lastName,
                                employer: employee.employer,
                                department: employee.department,
                                licensePlates: employee.licensePlates,
                                training: employee.training
                            }
                        });
                    });
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({
                    message: "Internal server error"
                });
            });
});

// GET request by id returns employee's complete data
app.get("/:id", (req, res) => {
    return Employees
        .findById(req.params.id)
        .then(employee => {
            console.log(`Sending response from GET request employee's complete data by id`);
            res.json({
                id: employee.id,
                photo: employee.photo,
                firstName: employee.firstName,
                lastName: employee.lastName,
                employer: employee.employer,
                department: employee.department,
                employmentDate: employee.employmentDate,
                allowVehicle: employee.allowVehicle,
                licensePlates: employee.licensePlates,
                training: employee.training
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                message: "Internal server error"
            });
        });
});


app.post("/login", (req, res) => {
    return res.status(200).json({
            message: "Login in"
        }).sendFile(__dirname + '/public/login.html');
})


app.post("/:id", (req, res) => {
    return res.status(200).json({
        message: "Creating employee account"
    }).sendFile(__dirname + '/public/employee.html');
})

app.put("/:id", (req, res) => {
    return res.status(200).json({
        message: "Editing employee by id"
    }).sendFile(__dirname + '/public/employee.html');
})

app.delete("/:id", (req, res) => {
    return res.status(200).json({
        message: "Deleting employee with id"
    }).sendFile(__dirname + '/public/employee.html');
})

app.get("/entrance/:id", (req, res) => {
    return res.status(200).json({
        message: "Showing employee with id info"
    }).sendFile(__dirname + '/public/entrance.html');
})



function runServer(databaseUrl, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(
            databaseUrl,
            err => {
                if (err) {
                    return reject(err);
                }
                server = app.listen(port, () => {
                        console.log(`Your app is listening on port ${port}`);
                        resolve();
                    })
                    .on('error', err => {
                        mongoose.disconnect();
                        reject(err);
                    });
            });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log("Closing server");
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };