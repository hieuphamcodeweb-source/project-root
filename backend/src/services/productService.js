const Product = require("../models/Product");

async function isSkuTaken(sku, excludeId = null) {
  const normalizedSku = String(sku).trim().toUpperCase();
  const query = { sku: normalizedSku };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const existingProduct = await Product.findOne(query).lean();
  return Boolean(existingProduct);
}

module.exports = {
  Product,
  isSkuTaken,
};
