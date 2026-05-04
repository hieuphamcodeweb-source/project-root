const { resolvePromoForOrder } = require("../../services/promoCodeService");
const { isDbConnected } = require("../../services/userService");

async function previewPromoCode(req, res) {
  if (!isDbConnected()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  const subtotal = Number(req.body?.subtotal);
  if (!Number.isFinite(subtotal) || subtotal < 0) {
    return res.status(400).json({ message: "subtotal must be a non-negative number." });
  }

  const userId = req.auth?.userId;

  try {
    const result = await resolvePromoForOrder(subtotal, req.body?.code, userId);
    return res.status(200).json({
      discount: result.discount,
      appliedCode: result.appliedCode,
      description: result.description,
      error: result.error,
      endsAt: result.endsAt,
      startsAt: result.startsAt,
      perUserUsageLimit: result.perUserUsageLimit,
      remainingForUser: result.remainingForUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to preview promo code.", error: error.message });
  }
}

module.exports = previewPromoCode;
