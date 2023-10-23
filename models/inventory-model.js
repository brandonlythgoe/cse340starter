const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get all classification data
 * ************************** */
async function getInventoryItem(){
  return await pool.query("SELECT * FROM public.inventory ORDER BY inv_make")
}

async function getInventoryItemDetail(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inventory_id]
    );
    return data.rows[0]; // Assuming inv_id is unique, so only one row should be returned
  } catch (error) {
    console.error("getInventoryItemDetail error " + error);
    throw error;
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryItem, getInventoryItemDetail};

