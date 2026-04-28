const { Product } = require("../../services/productService");
const { isDbConnected } = require("../../services/userService");

async function getProducts(req, res) {
  if (!isDbConnected()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      data: products,
      total: products.length,
      page: 1,
      pageSize: products.length,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch products.", error: error.message });
  }
}

module.exports = getProducts;
