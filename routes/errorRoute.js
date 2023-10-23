const express = require('express');
const router = express.Router();
const errorController = require('../controllers/errorController');
const intentionalErrorMiddleware = require('../middleware/errorMiddleware'); 

router.get('/trigger-intentional-error', errorController.triggerIntentionalError, intentionalErrorMiddleware);

module.exports = router;