const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");
const utilities = require("./index");

const validate = {};

const commonValidationRules = {
  isRequired: (field, message) => body(field).isLength({ min: 1 }).withMessage(message),
  isNumeric: (field, message) => body(field).isNumeric().withMessage(message),
  isValidImage: (field, message) => body(field).matches(".*\\.(jpg|jpeg|png|webp)$").withMessage(message),
};

validate.ClassificationRules = () => [
  body("classification_name")
    .trim()
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("Classification name should contain NO spaces or special characters.")
    .isLength({ min: 1 })
    .withMessage("Enter a classification name please")
    .custom(async (classification_name) => {
      const nameExists = await invModel.checkExistingName(classification_name);
      if (nameExists) {
        throw new Error(
          "Oops! That Classification name already exists, either refer back to that one or create a more unique name."
        );
      }
    }),
];

validate.ClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    await renderErrorPage(res, "inventory/add-classification", "New Classification", { classification_name }, errors);
    return;
  }

  next();
};

validate.InventoryRules = () => [
  commonValidationRules.isRequired("inv_make", "Oops! We need to know the vehicle make in order to proceed!"),
  commonValidationRules.isRequired("inv_model", "Oops! We need to know the vehicle model in order to proceed!"),
  commonValidationRules.isNumeric("inv_year", "Oops! We need to know the vehicle year in order to proceed!"),
  commonValidationRules.isRequired("inv_description", "Oops! We need to know the vehicle description in order to proceed!"),
  commonValidationRules.isValidImage("inv_image", "Oops! We need to have a valid vehicle image in order to proceed!"),
  commonValidationRules.isValidImage("inv_thumbnail", "Oops! We need to have a valid vehicle image in order to proceed!"),
  commonValidationRules.isNumeric("inv_price", "Oops! We need to know the vehicle price in order to proceed!"),
  commonValidationRules.isNumeric("inv_miles", "Oops! We need to know the vehicle mileage in order to proceed!"),
  commonValidationRules.isRequired("inv_color", "Oops! We need to know the vehicle color in order to proceed!"),
  commonValidationRules.isNumeric("classification_id", "Oops! We need to know the vehicle id in order to proceed!"),
];

validate.InventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const dropdown = await utilities.getDropDown();
    await renderErrorPage(res, "inventory/add-inventory", "New Inventory Item", {
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
    }, errors, { nav, dropdown });
    return;
  }

  next();
};

async function renderErrorPage(res, template, title, data, errors, extraData = {}) {
  const nav = await utilities.getNav();
  res.render(template, { errors, title, ...data, ...extraData, nav });
}

module.exports = validate;
