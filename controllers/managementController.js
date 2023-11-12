const utilities = require("../utilities");
const managementModel = require("../models/inventory-model");

async function buildManagement(req, res, next) {
    let nav = await utilities.getNav();
    res.render("inventory/management", {
        title: "Management",
        nav,
        errors: null,
    });
}

async function buildAddClassification(req, res, next) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
    });
}

async function AddClassification(req, res) {
    let nav = await utilities.getNav();
    const { classification_name } = req.body;
    const AddClassResult = await managementModel.AddClassification(classification_name);
    if (AddClassResult) {
        req.flash(
            "notice",
            `You added a new Classification!`
        );
        res.status(201).render("inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: null,
        });
    } else {
        req.flash("Oops! Unable to add a new inventory item, please try again.");
        res.status(501).render("inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: null,
        });
    }
}

async function buildAddInventory(req, res, next) {
    let nav = await utilities.getNav();
    let dropdown = await utilities.getDropDown();
    res.render("inventory/add-inventory", {
        title: "Add New Inventory",
        nav,
        dropdown,
        errors: null,
    });
}

async function AddInventory(req, res) {
    let nav = await utilities.getNav();
    let dropdown = await utilities.getDropDown();
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
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
    );
    if (AddInvResult) {
        req.flash(
            "notice",
            `Congrats! You successfully added a new Inventory Item!`
        );
        res.status(201).render("inventory/add-inventory", {
            title: "Add New Inventory",
            nav,
            dropdown,
            errors: null,
        });
    } else {
        req.flash("Oops! Unable to add a new inventory item, please try again.");
        res.status(501).render("inventory/add-inventory", {
            title: "Add New Inventory",
            nav,
            dropdown,
            errors: null,
        });
    }
}

module.exports = { buildManagement, buildAddClassification, AddClassification, buildAddInventory, AddInventory };
