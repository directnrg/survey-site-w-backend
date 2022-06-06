/*
Author: Multiverse Design
Date: Nov-17-2021
FileName : app.js
*/

let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors');
let favicon = require('serve-favicon');


//Modules for authentication
let session = require('express-session');
let passport = require('passport');

let passportLocal = require('passport-local');
let localStrategy = passportLocal.Strategy;
let flash = require('connect-flash');

//call function for guard purposes
let { requireAuth } = require('../utils/index');


//database setup

let mongoose = require('mongoose');
//configuration of enviroment variables for secured passwords and access urls
require('dotenv').config();

const databaseURI = process.env.APP_DATABASE_URL;
const secret = process.env.SECRET_KEY;

let app = express();

//point mongoose
mongoose.connect(databaseURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error:'));
mongoDB.once('open', () => {
    console.log('Connected to MongoDB succesfully');
});

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

// custom favicon setup
app.use(favicon(path.join(__dirname,'../../public/Assets/images/', 'Multiverse_icon.png')));

//setup express session
app.use(session({
    secret: secret,
    saveUninitialized: false,
    resave: false
}));

// initialize flash
app.use(flash());

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// create a User Model Instance
let userModel = require('../models/user');
let User = userModel.User;

// implement a User Authentication Strategy (fasop4)
passport.use(User.createStrategy());

// serialize and deserialize the User info
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//declaration of routers
let indexRouter = require('../routes/index');
let surveyRouter = require('../routes/survey');
let userRouter = require('../routes/user'); //TODO complete

//routing
app.use('/', indexRouter);
app.use('/surveys', requireAuth, surveyRouter);
app.use('/user', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', {
        title: 'Error'
    });
});

module.exports = app;