const express = require("express")
const router = new express.Router() 
const managementController = require("../controllers/managementController")
const utilities = require("../utilities")
const addValidate = require('../utilities/management-validation')

router.get("/", utilities.checkAccountAccess, utilities.handleErrors(managementController.buildManagement))
router.get("/classification", utilities.checkAccountAccess, utilities.handleErrors(managementController.buildAddClassification))
router.get("/inventory", utilities.checkAccountAccess, utilities.handleErrors(managementController.buildAddInventory))

router.post(
    "/classification", 
    addValidate.newClassificationRules(),
    addValidate.newClassificationData,
    utilities.handleErrors(managementController.AddClassification)
)
router.post(
    "/inventory",
    addValidate.newInventoryRules(),
    addValidate.newInventoryData,
    utilities.handleErrors(managementController.AddInventory)
)

module.exports = router;