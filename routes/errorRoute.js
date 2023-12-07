const express = require('express');
const router = express.Router();
const errorController = require('../controllers/errorController');
const intentionalErrorMiddleware = require('../middleware/errorMiddleware'); 
const utilities = require("../utilities")

router.get('/trigger-intentional-error', utilities.handleIntentionalErrors(errorController.triggerIntentionalError), intentionalErrorMiddleware);

module.exports = router;