const { PromoCode } = require("../../services/promoCodeService");
const { isDbConnected } = require("../../services/userService");

async function getPromoCodeById(req, res) {
  if (!isDbConnected()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const doc = await PromoCode.findById(req.params.id).lean();
    if (!doc) {
      return res.status(404).json({ message: "Promo code not found." });
    }
    return res.status(200).json({ data: doc });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch promo code.", error: error.message });
  }
}

module.exports = getPromoCodeById;
