'use strict';

// NPM dependencies.
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var sequelize = require('sequelize');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var path = require('path');
var cors = require('cors');

var PORT = 8081;

// App related modules.
var hookJWTStrategy = require('./app/services/passportStrategy');

// Initializations.
var app = express();

// Parse as urlencoded and json.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(cors());

// Hook up the HTTP logger.
app.use(morgan('dev'));

// Hook up Passport.
app.use(passport.initialize());

// Hook the passport JWT strategy.
hookJWTStrategy(passport);

app.all('*', function (req,res,next) {
    console.log(req.header("Authorization"));
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization ,Accept');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Expose-Headers', 'Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

    next();
});


// Set the static files location.
app.use(express.static(__dirname + '/public'));

// Bundle API routes.
app.use('/api', require('./app/routes/api')(passport));

/*
// Catch all route.
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});
*/

// Start the server.
app.listen(PORT, function() {
    console.log(`Magic happens at http://localhost:${PORT}/! We are now all now doomed!`);
});
