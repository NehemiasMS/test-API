var express = require('express');
var app = express();
var morgan = require('morgan');

var cors = require('express');


//var path = require('path');
// Configurations
app.set("port", 3000);
app.set('json spaces',2)

// Middleware
app.use(morgan("dev"));
app.use(express.json())

// Rutas
app.use('/api',require('./routes/routes'))

// APP
app.listen(app.get("port"));

