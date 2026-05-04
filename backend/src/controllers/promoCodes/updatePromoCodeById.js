const { PromoCode } = require("../../services/promoCodeService");
const { isDbConnected } = require("../../services/userService");
const validatePromoCodePayload = require("../../utils/validatePromoCodePayload");

async function updatePromoCodeById(req, res) {
  if (!isDbConnected()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  const parsed = validatePromoCodePayload(req.body);
  if (parsed.error) {
    return res.status(400).json({ message: parsed.error });
  }

  try {
    const existing = await PromoCode.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Promo code not found." });
    }

    const { data } = parsed;
    if (data.code !== existing.code) {
      const taken = await PromoCode.findOne({ code: data.code, _id: { $ne: existing._id } }).lean();
      if (taken) {
        return res.status(409).json({ message: "A promo code with this value already exists." });
      }
    }

    existing.set({
      ...data,
      usedCount: existing.usedCount,
    });
    await existing.save();

    return res.status(200).json({ message: "Promo code updated successfully.", data: existing.toObject() });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "A promo code with this value already exists." });
    }
    return res.status(500).json({ message: "Failed to update promo code.", error: error.message });
  }
}

module.exports = updatePromoCodeById;
