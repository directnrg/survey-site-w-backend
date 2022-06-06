let express = require('express');
let router = express.Router();
let userController = require('../controllers/user');


/* GET users listing. */
router.get('/', userController.userListing);

router.get('/login', userController.displayLoginPage);

/* POST Route for processing the Login page */
router.post('/login', userController.processLoginPage);

/* GET Route for displaying the Register page */
router.get('/register', userController.displayRegisterPage);

/* POST Route for processing the Register page */
router.post('/register', userController.processRegisterPage);

/* GET to perform UserLogout */
router.get('/logout', userController.performLogout);

module.exports = router;