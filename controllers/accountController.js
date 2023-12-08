const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account", {
      title: "Account Management",
      nav,
      errors: null,
  })
}

/* ****************************************
*  Deliver manage account info view
* *************************************** */
async function buildManageAccountInfo(req, res, next) {
  let nav = await utilities.getNav();
  const account_id = parseInt(req.params.account_id);
  const accountData = await accountModel.getAccountById(account_id);
  try {
    res.render("account/manageInfo", {
        title: "Edit Account Info",
        nav,
        errors: null,
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
    })
  } catch (error) {
    error.status = 500;
    console.error(error.status);
    next(error);
  }
}

/* ****************************************
*  Edit account info
* *************************************** */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav();
  try{
    const { 
      account_id,
      account_firstname,
      account_lastname,
      account_email
    } = req.body
    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    )
    if (updateResult) {
      const accountData = await accountModel.getAccountById(account_id);
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      req.flash("notice", "The update was successful.");
      res.redirect("/account/");
    } else {
      req.flash("warning", "Sorry, the addition failed.");
      res.status(501).render("./account/manageInfo", {
        title: "Edit Account Info",
        nav,
        errors: null,
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
      });
    }
  } catch (error) {
    error.status = 500;
    console.error(error.status);
    next(error);
  }
}

/* ****************************************
*  Update Password
* *************************************** */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav();
  const { account_id, account_password } = req.body;
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
    const updatePassword = await accountModel.updatePassword(
      account_id,
      hashedPassword
    );
    if (updatePassword) {
      req.flash("notice", "The update was successful.");
      res.redirect("/account/");
    } else {
      req.flash("warning", "Sorry, the addition failed.");
      res.status(501).render("./account/manageInfo", {
        title: "Edit Account Info",
        nav,
        errors: null,
        account_id: accountData.account_id,
      });
    }
  } catch (error) {
    req.flash("warning", "Sorry, the addition failed.");
    res.status(501).render("./account/manageInfo", {
      title: "Edit Account Info",
      nav,
      errors: null,
      account_id: accountData.account_id,
    });
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("warning", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("warning", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your login credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      return res.redirect("/account/")
    }
  } catch (error) {
    return new Error('Access Forbidden')
  }
}

/* ****************************************
 *  Logout
 * ************************************ */
// async function logout(req, res) {
//   utilities.logout(req, res, next);
//   req.flash("notice", "You have been logged out.");
//   return res.redirect("/");
// }
async function logout(req, res) {
  try {
    delete res.locals.accountData
    delete res.locals.loggedin
    res.clearCookie("jwt");
    req.flash("notice", "You have been logged out.");
    res.redirect("/");
  } catch (error) {
    return new Error('Access Forbidden')
  }
}

module.exports = { 
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin, 
  buildAccountManagement,
  buildManageAccountInfo,
  updateAccount,
  updatePassword,
  logout
 };