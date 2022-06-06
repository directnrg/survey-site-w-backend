/*
Author: Multiverse Design
Date: Nov-11-2021
FileName : index.js
*/
// Mohammad Wahiduzzaman
// create Model instances
let Survey = require('../models/survey');

//home page
module.exports.displayHomePage = (req, res, next) => {

    res.render('index', {
        title: 'Home',
        page: 'home',
        displayName: req.user ? req.user.displayName : ''
    });
}

//about page
module.exports.displayAboutPage = (req, res, next) => {
    res.render('index', {
        title: 'About Us',
        page: 'about',
        displayName: req.user ? req.user.displayName : ''
    });
}

//Project page rendering with passing different values
module.exports.displayProjectsPage = (req, res, next) => {
    res.render('index', {
        title: 'Projects',
        page: 'projects',
        displayName: req.user ? req.user.displayName : ''
    });
}

// Public surveys page
module.exports.displayPublicSurveysPage = (req, res, next) => {
    Survey.find((err, publicSurveyList) => {
        if (err) {
            return console.error(err);
        } else {

            let currentDate = new Date();
            res.render('index', {
                title: 'Public Surveys',
                page: 'survey/public-surveys',
                PublicSurveyList: publicSurveyList,
                displayName: req.user ? req.user.displayName : '',
                today: currentDate
            });
        }
    });
}

