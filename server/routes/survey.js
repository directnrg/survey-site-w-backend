/*
Author: Multiverse Design
Date: Nov-12-2021
FileName : survey.js
Routing for Survey list
*/

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let surveyController = require('../controllers/survey');

/* GET Route for READ Operation */
router.get('/', surveyController.displaySurveyList);

/* GET Route for CREATE Operation */
router.get('/add', surveyController.displayAddPage);

/* CREATE Operation */
router.post('/add', surveyController.processAddPage);

/* UPDATE Method */
router.get('/edit/:id', surveyController.displayEditPage);

/* Edit page - UPDATE Operation */
router.post('/edit/:id', surveyController.processEditPage);

/* GET to perform DELETE Operation */
router.get('/delete/:id', surveyController.performDelete);

//Fabian
/* GET to view report page */
router.get('/report/:id', surveyController.displayReportViewPage);

/* POST report page */
router.post('/report/:id', surveyController.displayReportViewPage)


module.exports = router;