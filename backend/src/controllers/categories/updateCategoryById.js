const { Category, isCategoryCodeTaken, isCategoryNameTaken } = require("../../services/categoryService");
const { isDbConnected } = require("../../services/userService");
const validateCategoryPayload = require("../../utils/validateCategoryPayload");

async function updateCategoryById(req, res) {
  if (!isDbConnected()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  const validationError = validateCategoryPayload(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const existingCategory = await Category.findById(req.params.id).lean();
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found." });
    }

    if (await isCategoryCodeTaken(req.body.categoryCode, existingCategory._id)) {
      return res.status(409).json({ message: "categoryCode must be unique." });
    }

    if (await isCategoryNameTaken(req.body.categoryName, existingCategory._id)) {
      return res.status(409).json({ message: "categoryName must be unique." });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        categoryCode: req.body.categoryCode.trim().toUpperCase(),
        categoryName: req.body.categoryName.trim(),
        status: req.body.status,
        sortOrder: req.body.sortOrder,
      },
      { new: true }
    ).lean();

    return res.status(200).json({ message: "Category updated successfully.", data: updatedCategory });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update category.", error: error.message });
  }
}

module.exports = updateCategoryById;
