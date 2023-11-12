const utilities = require("./index")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
 *  new classification Data Validation Rules
 * ********************************* */
validate.ClassificationRules = () => {
    return [
      body("classification_name")
        .trim()
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("Classification name should contain NO spaces or special characters.")
        .isLength({ min: 1 })
        .withMessage("Enter a classification name please")
        .custom(async (classification_name) => {
            const nameExists = await invModel.checkExistingName(classification_name)
            if (nameExists){
              throw new Error("Oops! That Classification name already exists, either refer back to that one or create a more unique name.")
            }
          }),
    ]
}


validate.ClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  const errors = validationResult(req);
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "New Classification",
      nav,
      classification_name
    })
    return
  }
  next()
}

/*  **********************************
 *  new inventory Data Validation Rules
 * ********************************* */
validate.InventoryRules = () => {
    return [
      body("inv_make")
        .isLength({ min: 1 })
        .withMessage("Oops! We need to know the vehicle make in order to proceed!"),
        
      body("inv_model")
        .isLength({ min: 1 })
        .withMessage("Oops! We need to know the vehicle model in order to proceed!"),

      body("inv_year")
        .isLength({ min: 4, max: 4 })
        .isNumeric()
        .withMessage("Oops! We need to know the vehicle year in order to proceed!"),

        body("inv_description")
        .isLength({ min: 1 })
        .withMessage("Oops! We need to know the vehicle description in order to proceed!"),

        body("inv_image")
        .isLength({ min: 1 })
        .withMessage("Oops! We need to have a valid vehicle image in order to proceed!  (jpg, jpeg, png, webp).")
        .matches(".*\\.(jpg|jpeg|png|webp)$"),

        body("inv_thumbnail")
        .isLength({ min: 1 })
        .withMessage("Oops! We need to have a valid vehicle image in order to proceed!")
        .matches(".*\\.(jpg|jpeg|png|webp)$"),

        body("inv_price")
        .isLength({ min: 1 })
        .isNumeric()
        .withMessage("Oops! We need to know the vehicle price in order to proceed!"),

        body("inv_miles")
        .isLength({ min: 1 })
        .isNumeric()
        .withMessage("Oops! We need to know the vehicle mileage in order to proceed!"),

        body("inv_color")
        .isLength({ min: 1 })
        .withMessage("Oops! We need to know the vehicle color in order to proceed!"),

        body("classification_id")
        .isLength({ min: 1 })
        .isNumeric()
        .withMessage("Oops! We need to know the vehicle id in order to proceed!")
    ]
}

validate.InventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    const errors = validationResult(req);
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let dropdown = await utilities.getDropDown()
      res.render("inventory/add-inventory", {
        errors,
        title: "New Inventory Item",
        nav,
        dropdown,
        inv_make, 
        inv_model, 
        inv_year, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_miles, 
        inv_color, 
        classification_id,
      })
      return
    }
    next()
}

module.exports = validate