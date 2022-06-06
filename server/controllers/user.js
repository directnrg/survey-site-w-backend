let passport = require('passport');
let jwt = require('jsonwebtoken');
let passLocal = require('passport-local');

let userModel = require('../models/user');
let User = userModel.User;

//enviroment variables
require('dotenv').config();

//TODO pending
module.exports.userListing = (req, res, next) => {
    res.send('Placeholder');
}

//login page
module.exports.displayLoginPage = (req, res, next) => {
    // check if the user is already logged in
    if (!req.user) {
        res.render('index', {
            title: "Login",
            page: "auth/login",
            messages: req.flash('loginMessage'),
            displayName: req.user ? req.user.displayName : ''
        })
    } else {
        return res.redirect('/home');
    }
}

//TODO work in progress user authentication POST 
module.exports.processLoginPage = (req, res, next) => {
    // instantiate a user object
    passport.authenticate('local', //local method to authenticate with passport
        (err, user, info) => {
            // server err?
            if (err) {
                return next(err);
            }
            // is there a user login error?
            if (!user) {
                req.flash('loginMessage', 'Authentication Error');
                return res.redirect('/login');
            }
            req.login(user, (err) => {
                // server error?
                if (err) {
                    return next(err);
                }

                return res.redirect('/home');
            });
        })(req, res, next);
}

//register page
module.exports.displayRegisterPage = (req, res, next) => {
    // check if the user is not already logged in
    if (!req.user) {
        res.render('index', {
            title: 'Register',
            page: "auth/register",
            messages: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName : ''
        });
    } else {
        return res.redirect('/');
    }
}

module.exports.processRegisterPage = (req, res, next) => {
    // instantiate a user object
    let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        displayName: req.body.firstName + " " + req.body.lastName
    });

    User.register(newUser, req.body.password, (err) => {
        if (err) {
            if (err.name == "UserExistsError") {
                req.flash(
                    'registerMessage',
                    'Registration Error: User Already Exists!'
                );
                console.log('Error: User Already Exists!')
            }
            return res.render('index', {
                title: 'Register',
                page: 'auth/register',
                messages: req.flash('registerMessage'),
                displayName: req.user ? req.user.displayName : ''
            });
        } else {

            return passport.authenticate('local')(req, res, () => {
                res.redirect('/home')
            });
        }
    });
}

//logout
module.exports.performLogout = (req, res, next) => {
    req.logout();
    res.redirect('/');
}