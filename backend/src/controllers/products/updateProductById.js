const { Product, isSkuTaken } = require("../../services/productService");
const { isDbConnected } = require("../../services/userService");
const validateProductPayload = require("../../utils/validateProductPayload");

async function updateProductById(req, res) {
  if (!isDbConnected()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  const validationError = validateProductPayload(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const existingProduct = await Product.findById(req.params.id).lean();
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (await isSkuTaken(req.body.sku, existingProduct._id)) {
      return res.status(409).json({ message: "sku must be unique." });
    }

    const payload = {
      ...req.body,
      sku: req.body.sku.trim().toUpperCase(),
      name: req.body.name.trim(),
      category: req.body.category.trim(),
      status: req.body.stock === 0 ? "inactive" : req.body.status,
      thumbnailUrl: req.body.thumbnailUrl.trim(),
      galleryUrls: req.body.galleryUrls.map((url) => url.trim()),
    };

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, payload, { new: true }).lean();
    return res.status(200).json({ message: "Product updated successfully.", data: updatedProduct });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update product.", error: error.message });
  }
}

module.exports = updateProductById;
