const { PromoCode } = require("../../services/promoCodeService");
const { isDbConnected } = require("../../services/userService");

async function getPromoCodes(req, res) {
  if (!isDbConnected()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const rows = await PromoCode.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({
      data: rows,
      total: rows.length,
      page: 1,
      pageSize: rows.length,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch promo codes.", error: error.message });
  }
}

module.exports = getPromoCodes;
