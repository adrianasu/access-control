const express = require('express');

const app = express();

// use express' static middleware function to serve our 
// static file inside 'public' folder
app.use(express.static('public'));
app.listen(process.env.PORT || 8080);