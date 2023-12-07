const utilities = require("../utilities/")
const managementModel = require("../models/inventory-model")

/* ****************************************
*  Deliver managgement view
* *************************************** */
async function buildManagement(req, res, next) {
    let nav = await utilities.getNav()
    const dropdown = await utilities.getDropDown()
    res.render("inventory/management", {
        title: "Management",
        nav,
        dropdown,
        errors: null,
    })
}

/* ****************************************
*  Deliver add classification view
* *************************************** */
async function buildAddClassification(req, res, next) {
    let nav = await utilities.getNav()
    res.render("inv/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Add New Classififcation
* *************************************** */
async function AddClassification(req, res) {
    let nav = await utilities.getNav()
    const { classification_name } = req.body
    const AddClassResult = await managementModel.AddClassification(classification_name)
    if (AddClassResult) {
        req.flash(
            "notice",
            `You added a new Classification!`
        )
        res.status(201).render("inv/management", {
            title: "Management",
            nav,
            errors: null,
        })
    } else {
        req.flash("warning", "Sorry, the addition failed.")
        res.status(501).render("inv/add-classification", {
          title: "New Classification",
          nav,
          errors: null,
        })
      }
}

/* ****************************************
*  Deliver add inventory view
* *************************************** */
async function buildAddInventory(req, res, next) {
    let nav = await utilities.getNav()
    let dropdown = await utilities.getDropDown()
    res.render("inv/add-inventory", {
        title: "Add Inventory",
        nav,
        dropdown,
        errors: null,
    })
}

/* ****************************************
*  Add New Inventory
* *************************************** */
async function AddInventory(req, res) {
    let nav = await utilities.getNav()
    let dropdown = await utilities.getDropDown()
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    const AddInvResult = await managementModel.AddInventory(
        inv_make, 
        inv_model, 
        inv_year, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_miles, 
        inv_color, 
        classification_id
    )
    if (AddInvResult) {
        req.flash(
            "notice",
            `You added a new Inventory Item!`
        )
        res.status(201).render("inv/management", {
            title: "Management",
            nav,
            dropdown,
            errors: null,
        })
    } else {
        req.flash("warning", "Sorry, the addition failed.")
        res.status(501).render("inv/add-inventory", {
          title: "New Inventory",
          nav,
          dropdown,
          errors: null,
        })
      }
}


module.exports = { buildManagement, buildAddClassification, AddClassification, buildAddInventory, AddInventory }