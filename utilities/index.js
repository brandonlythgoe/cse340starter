const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inventory/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* classification dropdown
* ************************************ */

// Util.getDropDown = async function (optionSelected) {
//   let data = await invModel.getClassifications();
//   let dropdown = '<select name="classification_id" id="classification_id" required>'
//   dropdown += "<option value=''>Choose a Classification</option>"
//   data.rows.forEach((row) => {
//     dropdown += `<option value="${row.classification_id}" ${row.classification_id === Number(optionSelected) ? "selected" : ""}>${row.classification_name}</option>`;
//   });
//   dropdown += "</select>";
//   return dropdown;
// }

Util.getDropDown = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let dropdown = '<select name="classification_id" id="classification_id">'
  dropdown += "<option>Choose a Classification</option>"
  data.rows.forEach((row) => {
    dropdown += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null && row.classification_id == classification_id
    ) {
      dropdown += " selected "
    }
    dropdown += ">" + row.classification_name + "</option>"
  })
  dropdown += "</select>"
  return dropdown
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inventory/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inventory/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

  
/* **************************************
 * Build HTML for the specific inventory item
 * ************************************ */
Util.buildInventoryItemHTML = function (itemDetail) {
  let itemHTML = '';

  if (itemDetail) {
    itemHTML += '<div class="inventory-detail">';
    itemHTML += `<img src="${itemDetail.inv_image}" alt="${itemDetail.inv_make} ${itemDetail.inv_model}" />`;
    itemHTML += '<div class="details">';
    itemHTML += `<p><strong>Make:</strong> ${itemDetail.inv_make}</p>`;
    itemHTML += `<p><strong>Model:</strong> ${itemDetail.inv_model}</p>`;
    itemHTML += `<p><strong>Year:</strong> ${itemDetail.inv_year}</p>`;
    itemHTML += `<p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(itemDetail.inv_price)}</p>`;
    itemHTML += `<p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(itemDetail.inv_miles)} miles</p>`;
    itemHTML += `<p><strong>Color:</strong> ${itemDetail.inv_color}</p>`;
    itemHTML += `<p><strong>Description:</strong> ${itemDetail.inv_description}</p>`;
    // Add other details as needed
    itemHTML += '</div>';
    itemHTML += '</div>';
  } else {
    itemHTML += '<p class="notice">Sorry, the requested vehicle details could not be found.</p>';
  }

  return itemHTML;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)  
Util.handleIntentionalErrors = fn => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(err => {
    next({ status: 500, message: err.message });
});

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else {
    next()
  }
}

/* ****************************************
* Middleware to check if account type is valid
**************************************** */
Util.checkAccountAccess = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
          res.locals.accountData = accountData;
          res.locals.loggedin = 1;
          next()
      })
  } else {
    next()
  }
};



/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}


module.exports = Util