const invModel = require("../models/inventory-model")
// const managementModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav, 
      grid,
      errors: null,
    });
  } catch (error) {
  console.error("getInventoryItemDetail error " + error);
    // Handle the error and send an appropriate response
    res.status(500).send("Internal Server Error");
  }
};
/* ***************************
 *  Get inventory item details by inventory_id
 * ************************** */
invCont.getInventoryItemDetail = async function (req, res, next) {
  try {
    const inventory_id = req.params.invId;
    const itemDetail = await invModel.getInventoryItemDetail(inventory_id);
    const formattedItem = utilities.buildInventoryItemHTML(itemDetail);
    let nav = await utilities.getNav();
    res.render("./inventory/inventory_detail", {
      title: `${itemDetail.inv_make} ${itemDetail.inv_model}`,
      itemDetail: formattedItem,
      nav,
      errors: null,
    });
  } catch (error) {
    console.error("getInventoryItemDetail error " + error);
    // Handle the error and send an appropriate response
    res.status(500).send("Internal Server Error");
  }
};

invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  console.log(classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ****************************************
*  Deliver edit inventory view
* *************************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryItemDetail(inv_id)
  let dropdown = await utilities.getDropDown(itemData.classification_id)
  console.log(inv_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      dropdown: dropdown,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id,
  })
}

/* ****************************************
*  Edit Inventory
* *************************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { 
    inv_id,
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
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )
    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("notice", `The ${itemName} was successfully updated.`)
      res.redirect("/inv/")
    } else {
      let dropdown = await utilities.getDropDown(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("warning", "Sorry, the addition failed.")
      res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        dropdown,
        errors: null,
        inv_id,
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
      })
    }
}

/* ****************************************
*  Deliver delete inventory confirmation view
* *************************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryItemDetail(inv_id)
  let dropdown = await utilities.getDropDown(itemData.classification_id)
  console.log(inv_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      dropdown: dropdown,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id,
  })
}

/* ****************************************
*  delete Inventory
* *************************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { 
    inv_id,
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
  } = req.body
  const deleteResult = await invModel.deleteInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )
  if (deleteResult) {
    console.log(deleteResult)
    const itemName = deleteResult.inv_make + " " + deleteResult.inv_model
    console.log(itemName)
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    let dropdown = await utilities.getDropDown(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("warning", "Sorry, the deletion failed.")
    res.status(501).render("inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      dropdown,
      errors: null,
      inv_id,
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
    })
  }
}


module.exports = invCont