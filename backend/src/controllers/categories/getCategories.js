const { Category } = require("../../services/categoryService");
const { isDbConnected } = require("../../services/userService");

async function getCategories(req, res) {
  if (!isDbConnected()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const categories = await Category.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    return res.status(200).json({
      data: categories,
      total: categories.length,
      page: 1,
      pageSize: categories.length,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch categories.", error: error.message });
  }
}

module.exports = getCategories;
