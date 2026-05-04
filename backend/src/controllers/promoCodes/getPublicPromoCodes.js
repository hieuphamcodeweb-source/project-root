const { PromoCode, publicListingQuery, getPromoCheckoutMeta } = require("../../services/promoCodeService");
const { isDbConnected } = require("../../services/userService");

async function getPublicPromoCodes(req, res) {
  if (!isDbConnected()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const rows = await PromoCode.find(publicListingQuery())
      .select("code description perUserUsageLimit usageLimit endsAt startsAt")
      .sort({ code: 1 })
      .lean();

    const userId = req.auth?.userId;

    const data = await Promise.all(
      rows.map(async (r) => {
        const meta = await getPromoCheckoutMeta(r, userId);
        const canApply =
          meta.perUserUsageLimit == null ||
          meta.remainingForUser == null ||
          meta.remainingForUser > 0;
        return {
          code: r.code,
          description: r.description,
          ...meta,
          canApply,
        };
      })
    );

    const listable = data.filter((x) => x.canApply);
    return res.status(200).json({ data: listable });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch promo codes.", error: error.message });
  }
}

module.exports = getPublicPromoCodes;
