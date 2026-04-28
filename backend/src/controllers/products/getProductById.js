const { Product } = require("../../services/productService");
const { isDbConnected } = require("../../services/userService");

async function getProductById(req, res) {
  if (!isDbConnected()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json({ data: product });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch product.", error: error.message });
  }
}

module.exports = getProductById;
