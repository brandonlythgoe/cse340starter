const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const addValidate = require('../utilities/management-validation')

// Route to build inventory by classification view
router.get("/", utilities.checkLogin, utilities.handleErrors(invController.buildManagement))
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.getInventoryItemDetail));
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView));
router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteInventoryView));

router.post("/update/", 
    addValidate.newInventoryRules(),
    addValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory));

router.post("/delete/", 
    utilities.handleErrors(invController.deleteInventory));

    

router.get("/classification", utilities.checkAccountAccess, utilities.handleErrors(invController.buildAddClassification))
router.get("/inventory", utilities.checkAccountAccess, utilities.handleErrors(invController.buildAddInventory))

router.post(
    "/classification", 
    addValidate.newClassificationRules(),
    addValidate.newClassificationData,
    utilities.handleErrors(invController.AddClassification)
)
router.post(
    "/inventory",
    addValidate.newInventoryRules(),
    addValidate.newInventoryData,
    utilities.handleErrors(invController.AddInventory)
)



module.exports = router;