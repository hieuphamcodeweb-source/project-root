const Order = require("../../models/Order");
const { resolveOrderLookup } = require("../../utils/orderLookup");

const allowedStatuses = new Set(["pending", "confirmed", "completed", "cancelled"]);

async function updateOrderStatus(req, res) {
  const nextStatus = String(req.body?.status || "").trim().toLowerCase();
  if (!allowedStatuses.has(nextStatus)) {
    return res.status(400).json({ message: "Trạng thái đơn hàng không hợp lệ." });
  }

  try {
    const lookup = resolveOrderLookup(req.params.id);
    if (!lookup) {
      return res.status(400).json({ message: "Thiếu mã đơn hàng hoặc ID." });
    }
    const updatedOrder = await Order.findOneAndUpdate(lookup, { status: nextStatus }, { new: true }).lean();
    if (!updatedOrder) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }
    return res.status(200).json({
      message: "Cập nhật trạng thái đơn hàng thành công.",
      data: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({ message: "Không thể cập nhật trạng thái đơn hàng.", error: error.message });
  }
}

module.exports = updateOrderStatus;
