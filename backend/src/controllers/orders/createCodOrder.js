const Cart = require("../../models/Cart");
const Order = require("../../models/Order");
const Product = require("../../models/Product");

function normalizeRequestedItems(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => ({
      productId: String(item.productId || "").trim(),
      quantity: Math.max(0, Number(item.quantity || 0)),
    }))
    .filter((item) => item.productId && item.quantity > 0);
}

async function createCodOrder(req, res) {
  try {
    const userId = Number(req.auth?.userId);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({ message: "Invalid user in token. Please login again." });
    }

    const requestedItems = normalizeRequestedItems(req.body?.items);
    if (requestedItems.length === 0) {
      return res.status(400).json({ message: "At least one order item is required." });
    }

    const requestedMap = new Map();
    for (const item of requestedItems) {
      const existingQty = requestedMap.get(item.productId) || 0;
      requestedMap.set(item.productId, existingQty + item.quantity);
    }

    const productIds = [...requestedMap.keys()];
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    if (products.length !== productIds.length) {
      return res.status(404).json({ message: "One or more products not found." });
    }

    const productMap = new Map(products.map((product) => [String(product._id), product]));
    const orderItems = [];

    for (const [productId, quantity] of requestedMap.entries()) {
      const product = productMap.get(productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${productId}` });
      }
      if (product.stock < quantity) {
        return res.status(409).json({ message: `Not enough stock for ${product.name}.` });
      }

      orderItems.push({
        productId: product._id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity,
        subtotal: product.price * quantity,
      });
    }

    for (const item of orderItems) {
      const updated = await Product.updateOne({ _id: item.productId, stock: { $gte: item.quantity } }, { $inc: { stock: -item.quantity } });
      if (!updated.modifiedCount) {
        return res.status(409).json({ message: `Stock changed for ${item.name}. Please try again.` });
      }
    }

    const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    const order = await Order.create({
      userId,
      paymentMethod: "COD",
      status: "pending",
      totalAmount,
      items: orderItems,
    });

    const existingCart = await Cart.findOne({ userId }).lean();
    if (existingCart) {
      const updatedCartItems = (existingCart.items || [])
        .map((cartItem) => {
          const purchasedQty = requestedMap.get(String(cartItem.productId)) || 0;
          if (purchasedQty <= 0) return cartItem;
          return { ...cartItem, quantity: Math.max(0, Number(cartItem.quantity || 0) - purchasedQty) };
        })
        .filter((cartItem) => Number(cartItem.quantity || 0) > 0);

      await Cart.findOneAndUpdate({ userId }, { userId, items: updatedCartItems }, { upsert: true });
    }

    return res.status(201).json({
      message: "Order placed successfully with COD.",
      data: {
        orderId: order._id,
        totalAmount,
        items: orderItems,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create COD order.", error: error.message });
  }
}

module.exports = createCodOrder;
