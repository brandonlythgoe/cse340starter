const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));
router.get("/manageInfo/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildManageAccountInfo));
router.get("/logout", utilities.handleErrors(accountController.logout));


router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLogData,
    utilities.handleErrors(accountController.accountLogin)
)

router.post(
    "/update", 
    regValidate.updateRules(),
    regValidate.checkUpdateAccountData,
    utilities.handleErrors(accountController.updateAccount));

router.post(
    "/updatepassword", 
    regValidate.updatePasswordRules(),
    regValidate.checkUpdatePasswordData,
    utilities.handleErrors(accountController.updatePassword));

module.exports = router;