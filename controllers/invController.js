const invModel = require("../models/inventory-model")
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
    });
  } catch (error) {
    console.error("getInventoryItemDetail error " + error);
    // Handle the error and send an appropriate response
    res.status(500).send("Internal Server Error");
  }
};
module.exports = invCont