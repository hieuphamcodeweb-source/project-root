const Order = require("../../models/Order");

const allowedStatuses = new Set(["pending", "confirmed", "completed", "cancelled"]);

async function updateOrderStatus(req, res) {
  const nextStatus = String(req.body?.status || "").trim().toLowerCase();
  if (!allowedStatuses.has(nextStatus)) {
    return res.status(400).json({ message: "Invalid order status." });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status: nextStatus }, { new: true }).lean();
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }
    return res.status(200).json({
      message: "Order status updated successfully.",
      data: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update order status.", error: error.message });
  }
}

module.exports = updateOrderStatus;
