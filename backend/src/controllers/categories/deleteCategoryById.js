const { Category } = require("../../services/categoryService");
const { isDbConnected } = require("../../services/userService");

async function deleteCategoryById(req, res) {
  if (!isDbConnected()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id).lean();
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found." });
    }

    return res.status(200).json({ message: "Category deleted successfully.", data: deletedCategory });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete category.", error: error.message });
  }
}

module.exports = deleteCategoryById;
