const { Product } = require("../../services/productService");
const { isDbConnected } = require("../../services/userService");

async function getProducts(req, res) {
  if (!isDbConnected()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    const normalizedProducts = products.map((product) => ({
      ...product,
      status: product.stock <= 0 ? "inactive" : product.status,
    }));

    return res.status(200).json({
      data: normalizedProducts,
      total: normalizedProducts.length,
      page: 1,
      pageSize: normalizedProducts.length,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch products.", error: error.message });
  }
}

module.exports = getProducts;
