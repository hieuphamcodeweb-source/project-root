const Category = require("../models/Category");

async function isCategoryCodeTaken(categoryCode, excludeId = null) {
  const query = { categoryCode: String(categoryCode).trim().toUpperCase() };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const existingCategory = await Category.findOne(query).lean();
  return Boolean(existingCategory);
}

async function isCategoryNameTaken(categoryName, excludeId = null) {
  const query = { categoryName: String(categoryName).trim() };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const existingCategory = await Category.findOne(query).lean();
  return Boolean(existingCategory);
}

module.exports = {
  Category,
  isCategoryCodeTaken,
  isCategoryNameTaken,
};
