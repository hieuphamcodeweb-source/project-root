const { PromoCode } = require("../../services/promoCodeService");
const { isDbConnected } = require("../../services/userService");
const validatePromoCodePayload = require("../../utils/validatePromoCodePayload");

async function createPromoCode(req, res) {
  if (!isDbConnected()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  const parsed = validatePromoCodePayload(req.body);
  if (parsed.error) {
    return res.status(400).json({ message: parsed.error });
  }

  try {
    const { data } = parsed;
    const exists = await PromoCode.findOne({ code: data.code }).lean();
    if (exists) {
      return res.status(409).json({ message: "A promo code with this value already exists." });
    }

    const doc = await PromoCode.create(data);
    return res.status(201).json({ message: "Promo code created successfully.", data: doc.toObject() });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "A promo code with this value already exists." });
    }
    return res.status(500).json({ message: "Failed to create promo code.", error: error.message });
  }
}

module.exports = createPromoCode;
