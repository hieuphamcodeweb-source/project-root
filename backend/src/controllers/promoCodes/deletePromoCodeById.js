const { PromoCode } = require("../../services/promoCodeService");
const { isDbConnected } = require("../../services/userService");

async function deletePromoCodeById(req, res) {
  if (!isDbConnected()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const deleted = await PromoCode.findByIdAndDelete(req.params.id).lean();
    if (!deleted) {
      return res.status(404).json({ message: "Promo code not found." });
    }
    return res.status(200).json({ message: "Promo code deleted successfully.", data: deleted });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete promo code.", error: error.message });
  }
}

module.exports = deletePromoCodeById;
