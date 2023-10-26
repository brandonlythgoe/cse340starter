// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Define a route to retrieve a specific vehicle by ID
router.get("/detail/:invId", utilities.handleErrors(invController.getInventoryItemDetail));

module.exports = router;

