const { Product, isSkuTaken } = require("../../services/productService");
const { isDbConnected } = require("../../services/userService");
const validateProductPayload = require("../../utils/validateProductPayload");

async function createProduct(req, res) {
  if (!isDbConnected()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  const validationError = validateProductPayload(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    if (await isSkuTaken(req.body.sku)) {
      return res.status(409).json({ message: "sku must be unique." });
    }

    const payload = {
      ...req.body,
      sku: req.body.sku.trim().toUpperCase(),
      name: req.body.name.trim(),
      category: req.body.category.trim(),
      thumbnailUrl: req.body.thumbnailUrl.trim(),
      galleryUrls: req.body.galleryUrls.map((url) => url.trim()),
    };

    const product = await Product.create(payload);
    return res.status(201).json({ message: "Product created successfully.", data: product.toObject() });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create product.", error: error.message });
  }
}

module.exports = createProduct;
