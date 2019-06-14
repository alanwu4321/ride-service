var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');

var ridesController = require('./routes/rides');
// var usersRouter = require('./routes/users');

var app = express();
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/rides', ridesController);
// app.use('/users', usersRouter);

module.exports = app;
