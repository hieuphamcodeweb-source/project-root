const Order = require("../../models/Order");
const Product = require("../../models/Product");
const User = require("../../models/User");
const { resolveOrderLookup } = require("../../utils/orderLookup");

async function getOrderById(req, res) {
  try {
    const lookup = resolveOrderLookup(req.params.id);
    if (!lookup) {
      return res.status(400).json({ message: "Thiếu mã đơn hàng hoặc ID." });
    }
    const order = await Order.findOne(lookup).lean();
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }

    const user = await User.findOne({ id: order.userId }).select("id username").lean();
    const productIds = [...new Set((order.items || []).map((item) => String(item.productId)))];
    const products = await Product.find({ _id: { $in: productIds } })
      .select("_id name category thumbnailUrl price sku")
      .lean();
    const productMap = new Map(products.map((product) => [String(product._id), product]));

    const enrichedOrder = {
      ...order,
      customerName: user?.username || `User #${order.userId}`,
      items: (order.items || []).map((item) => {
        const product = productMap.get(String(item.productId));
        return {
          ...item,
          productId: String(item.productId),
          product: product
            ? {
                _id: String(product._id),
                name: product.name,
                category: product.category,
                thumbnailUrl: product.thumbnailUrl,
                sku: product.sku,
                currentPrice: product.price,
              }
            : null,
        };
      }),
    };

    return res.status(200).json({ data: enrichedOrder });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch order.", error: error.message });
  }
}

module.exports = getOrderById;
