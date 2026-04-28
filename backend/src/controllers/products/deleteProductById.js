const { Product } = require("../../services/productService");
const { isDbConnected } = require("../../services/userService");

async function deleteProductById(req, res) {
  if (!isDbConnected()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id).lean();
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json({ message: "Product deleted successfully.", data: deletedProduct });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete product.", error: error.message });
  }
}

module.exports = deleteProductById;
