const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const Grid = require('gridfs-stream');


const { DATABASE_URL, PORT, HTTP_STATUS_CODES } = require("./config");

const { employeeRouter } = require('./employee/employee.router');
const { userRouter } = require('./user/user.router');
const { authRouter } = require('./auth/auth.router');
const { employerRouter } = require('./employer/employer.router');
const { departmentRouter } = require('./department/department.router');
const { trainingRouter } = require('./training/training.router');
const { localStrategy, jwtStrategy } = require('./auth/auth.strategy');
const { optionsRouter } = require('./options/options.router');

const app = express(); // initialize express server

passport.use(localStrategy); // configure Passport to use our localStrategy when receiving username/password
passport.use(jwtStrategy); // configure Passport to use our jwtStrategy when receiving JWTokens

mongoose.Promise = global.Promise;

let mongoUrl;


// middleware
app.use(morgan('common')); // allows morgan to intercept and log all HTTP requests
app.use(express.json()); // required to parse and save JSON data payload into request body
app.use(express.static('public')); // serve static files inside 'public' folder


// routers setup to redirect calls to the right router
app.use('/api/employee', employeeRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter); 
app.use('/api/employer', employerRouter);
app.use('/api/department', departmentRouter);
app.use('/api/training', trainingRouter);
app.use('/api/options', optionsRouter);

// handle unexpected HTTP requests
app.use('*', (req,res) => {
    res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ error: 'Not Found'});
});

// handle unexpected errors
app.all('*', (err, req, res, next) => {
    res.status(err.code || 400).json({err: err});
});

function runServer(databaseUrl, port = PORT) {
    mongoUrl = databaseUrl;
    return new Promise((resolve, reject) => {
                             
      mongoose.connect(
            databaseUrl,
            err => {
                if (err) {
                    return reject(err);
                }
                server = app.listen(port, () => {
                       // gfs = Grid(conn.db, mongoose.mongo);
                        console.log(`Your app is listening on port ${port}`);
                        //})
                        const conn = mongoose.createConnection(databaseUrl);
                        conn.once('open', () => {
                            gfs = Grid(conn.db, mongoose.mongo);
                        })
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

module.exports = { app, runServer, closeServer, mongoUrl };