const express = require("express")
const router = new express.Router() 
const managementController = require("../controllers/managementController")
const utilities = require("../utilities")
const addValidate = require('../utilities/management-validation')

router.get("/", utilities.handleErrors(managementController.buildManagement))
router.get("/classification", utilities.handleErrors(managementController.buildAddClassification))
router.get("/inventory", utilities.handleErrors(managementController.buildAddInventory))

router.post(
    "/classification", 
    addValidate.ClassificationRules(),
    addValidate.ClassificationData,
    utilities.handleErrors(managementController.AddClassification)
)
router.post(
    "/inventory",
    addValidate.InventoryRules(),
    addValidate.InventoryData,
    utilities.handleErrors(managementController.AddInventory)
)

module.exports = router;