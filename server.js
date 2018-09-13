const express = require('express');

const app = express();

// use express' static middleware function to serve our 
// static file inside 'public' folder
app.use(express.static('public'));

app.get("/", (req, res) => {
    return res.status(200).json({message: "Testing API"})
    .sendFile(__dirname + '/public/index.html');
});

app.post("/login", (req, res) => {
    return res.status(200).json({
            message: "Login in"
        }).sendFile(__dirname + '/public/login.html');
})

app.get("/:id", (req, res) => {
    return res.status(200).json({
        message: "Getting employee by id"
    }).sendFile(__dirname + '/public/employee.html');
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






function runServer() {
    const port = process.env.PORT || 8080;
    return new Promise((resolve, reject) => {
        server = app
            .listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve(server);
            })
            .on('error', err => {
                reject(err);
            });
    });
}

function closeServer() {
    return new Promise((resolve, reject) => {
        console.log("Closing server");
        server.close(err => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}


if (require.main === module) {
    runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };