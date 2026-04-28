const { Category } = require("../../services/categoryService");
const { isDbConnected } = require("../../services/userService");

async function getCategoryById(req, res) {
  if (!isDbConnected()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const category = await Category.findById(req.params.id).lean();
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    return res.status(200).json({ data: category });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch category.", error: error.message });
  }
}

module.exports = getCategoryById;
