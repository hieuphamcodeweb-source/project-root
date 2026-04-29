const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

function normalizeItems(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => ({
      productId: String(item.productId || "").trim(),
      name: String(item.name || "").trim(),
      price: Number(item.price || 0),
      thumbnailUrl: String(item.thumbnailUrl || "").trim(),
      stock: Math.max(0, Number(item.stock || 0)),
      quantity: Math.max(0, Number(item.quantity || 0)),
    }))
    .filter((item) => item.productId && item.name && item.thumbnailUrl && item.quantity > 0);
}

async function syncItemsWithLatestProductData(items) {
  if (!items.length) return [];

  const productIds = [...new Set(items.map((item) => item.productId))];
  const products = await Product.find({ _id: { $in: productIds } }).lean();
  const productMap = new Map(products.map((product) => [String(product._id), product]));

  return items
    .map((item) => {
      const product = productMap.get(item.productId);
      if (!product) return null;

      const nextQuantity = Math.min(item.quantity, Math.max(0, Number(product.stock || 0)));
      if (nextQuantity <= 0) return null;

      return {
        productId: String(product._id),
        name: product.name,
        price: product.price,
        thumbnailUrl: product.thumbnailUrl,
        stock: product.stock,
        quantity: nextQuantity,
      };
    })
    .filter(Boolean);
}

async function updateMyCart(req, res) {
  try {
    const userId = Number(req.auth?.userId);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({ message: "Invalid user in token. Please login again." });
    }

    const items = await syncItemsWithLatestProductData(normalizeItems(req.body?.items));

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { userId, items },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return res.status(200).json({
      message: "Cart saved successfully.",
      data: {
        userId,
        items: cart.items || [],
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to save cart.", error: error.message });
  }
}

module.exports = updateMyCart;
