const { Category, isCategoryCodeTaken, isCategoryNameTaken } = require("../../services/categoryService");
const { isDbConnected } = require("../../services/userService");
const validateCategoryPayload = require("../../utils/validateCategoryPayload");

async function createCategory(req, res) {
  if (!isDbConnected()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  const validationError = validateCategoryPayload(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    if (await isCategoryCodeTaken(req.body.categoryCode)) {
      return res.status(409).json({ message: "categoryCode must be unique." });
    }

    if (await isCategoryNameTaken(req.body.categoryName)) {
      return res.status(409).json({ message: "categoryName must be unique." });
    }

    const category = await Category.create({
      categoryCode: req.body.categoryCode.trim().toUpperCase(),
      categoryName: req.body.categoryName.trim(),
      status: req.body.status,
      sortOrder: req.body.sortOrder,
    });

    return res.status(201).json({ message: "Category created successfully.", data: category.toObject() });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create category.", error: error.message });
  }
}

module.exports = createCategory;
