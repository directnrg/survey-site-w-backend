let express = require('express');
let router = express.Router();

let indexController = require('../controllers/index');
//Fabian
let surveyController = require('../controllers/survey');


/* GET home page. */
router.get('/', indexController.displayHomePage);

router.get('/home', indexController.displayHomePage);

//TODO
/* GET About Us page. */
router.get('/about', indexController.displayAboutPage);

/* GET projects page. */
router.get('/projects', indexController.displayProjectsPage);
//TODO
/* GET PublicSurveys Page Us page. */
router.get('/public-surveys', indexController.displayPublicSurveysPage);

//Fabian
/* GET Route for displaying the View Survey page - UPDATE Operation */
router.get('/public-surveys/:id', surveyController.displayExistingSurveyPage);

/* POST Route for submitting survey page - Operation */
router.post('/public-surveys/:id', surveyController.processExistingSurveyPage);

module.exports = router;
