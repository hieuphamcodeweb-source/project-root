const Order = require("../../models/Order");
const Product = require("../../models/Product");
const User = require("../../models/User");

async function getOrders(req, res) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    const userIds = [...new Set(orders.map((order) => order.userId))];
    const users = await User.find({ id: { $in: userIds } }).select("id username").lean();
    const userMap = new Map(users.map((user) => [user.id, user.username]));

    const productIds = [
      ...new Set(
        orders.flatMap((order) => (order.items || []).map((item) => String(item.productId)))
      ),
    ];
    const products = await Product.find({ _id: { $in: productIds } })
      .select("_id name category thumbnailUrl price")
      .lean();
    const productMap = new Map(products.map((product) => [String(product._id), product]));

    const enrichedOrders = orders.map((order) => ({
      ...order,
      customerName: userMap.get(order.userId) || `User #${order.userId}`,
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
                currentPrice: product.price,
              }
            : null,
        };
      }),
    }));

    return res.status(200).json({
      data: enrichedOrders,
      total: enrichedOrders.length,
      page: 1,
      pageSize: enrichedOrders.length,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch orders.", error: error.message });
  }
}

module.exports = getOrders;
