let mongoose = require('mongoose');
let passport = require('passport');


// helper function for guard purposes
function requireAuth (req, res, next) 
{
    // check if the user is logged in
    if(!req.isAuthenticated())
    {
        return res.redirect('/user/login');
    }
    next();
}

module.exports = {requireAuth};