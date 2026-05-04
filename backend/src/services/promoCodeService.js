const PromoCode = require("../models/PromoCode");
const Order = require("../models/Order");

function roundMoney(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}

function normalizeCode(raw) {
  return String(raw || "")
    .trim()
    .toUpperCase();
}

/** Max successful orders per user for this promo; null = unlimited per user. Legacy: falls back to usageLimit. */
function getEffectivePerUserUsageLimit(promo) {
  if (promo == null) return null;
  if (promo.perUserUsageLimit != null) return Number(promo.perUserUsageLimit);
  if (promo.usageLimit != null) return Number(promo.usageLimit);
  return null;
}

function computeDiscountFromPromo(promo, subtotal) {
  const now = new Date();

  if (!promo.isActive) {
    return { discount: 0, error: "Mã khuyến mãi này không còn hiệu lực." };
  }
  if (promo.startsAt) {
    const s = new Date(promo.startsAt);
    if (now < s) return { discount: 0, error: "Mã khuyến mãi này chưa có hiệu lực." };
  }
  if (promo.endsAt) {
    const e = new Date(promo.endsAt);
    if (now > e) return { discount: 0, error: "Mã khuyến mãi này đã hết hạn." };
  }
  if (!(subtotal > 0)) {
    return { discount: 0, error: "Tổng phụ của giỏ hàng phải dương." };
  }

  const minOrder = Number(promo.minOrderAmount || 0);
  if (subtotal < minOrder) {
    return {
      discount: 0,
      error: `Đơn tối thiểu $${minOrder.toFixed(2)} để áp dụng mã này.`,
    };
  }

  if (promo.discountType === "percent") {
    const pct = Number(promo.value);
    if (!(pct > 0) || pct > 100) {
      return { discount: 0, error: "Cấu hình khuyến mãi không hợp lệ." };
    }
    let discount = roundMoney((subtotal * pct) / 100);
    const cap = promo.maxDiscountAmount;
    if (cap != null && Number(cap) > 0) {
      discount = Math.min(discount, Number(cap));
    }
    discount = Math.min(discount, subtotal);
    return { discount: roundMoney(discount), error: null };
  }

  if (promo.discountType === "fixed") {
    const fixed = Number(promo.value);
    if (!(fixed > 0)) {
      return { discount: 0, error: "Cấu hình khuyến mãi không hợp lệ." };
    }
    const discount = Math.min(fixed, subtotal);
    return { discount: roundMoney(discount), error: null };
  }

  return { discount: 0, error: "Cấu hình khuyến mãi không hợp lệ." };
}

async function countUserRedemptions(userId, promoCodeStr) {
  return Order.countDocuments({
    userId,
    promoCode: promoCodeStr,
    status: { $ne: "cancelled" },
  });
}

async function getPromoCheckoutMeta(promo, userId) {
  const lim = getEffectivePerUserUsageLimit(promo);
  let remainingForUser = null;
  if (lim != null && Number.isInteger(userId) && userId > 0) {
    const used = await countUserRedemptions(userId, promo.code);
    remainingForUser = Math.max(0, lim - used);
  }

  return {
    endsAt: promo.endsAt ? new Date(promo.endsAt).toISOString() : null,
    startsAt: promo.startsAt ? new Date(promo.startsAt).toISOString() : null,
    perUserUsageLimit: lim,
    remainingForUser,
  };
}

const EMPTY_CHECKOUT_META = {
  endsAt: null,
  startsAt: null,
  perUserUsageLimit: null,
  remainingForUser: null,
};

async function resolvePromoForOrder(subtotal, rawCode, userId) {
  const code = normalizeCode(rawCode);
  if (!code) {
    return { discount: 0, appliedCode: null, promoId: null, description: "", error: null, ...EMPTY_CHECKOUT_META };
  }

  const promo = await PromoCode.findOne({ code }).lean();
  if (!promo) {
    return {
      discount: 0,
      appliedCode: null,
      promoId: null,
      description: "",
      error: "Mã khuyến mãi không hợp lệ hoặc không xác định.",
      ...EMPTY_CHECKOUT_META,
    };
  }

  const meta = await getPromoCheckoutMeta(promo, userId);

  const { discount, error } = computeDiscountFromPromo(promo, subtotal);
  if (error) {
    return {
      discount: 0,
      appliedCode: null,
      promoId: null,
      description: promo.description || "",
      error,
      ...meta,
    };
  }

  const perUserLimit = getEffectivePerUserUsageLimit(promo);
  if (perUserLimit != null && Number.isInteger(userId) && userId > 0) {
    const used = await countUserRedemptions(userId, promo.code);
    if (used >= perUserLimit) {
      return {
        discount: 0,
        appliedCode: null,
        promoId: null,
        description: promo.description || "",
        error: "Bạn đã dùng hết số lần áp dụng mã này cho tài khoản của mình.",
        ...meta,
        remainingForUser: 0,
      };
    }
  }

  return {
    discount,
    appliedCode: promo.code,
    promoId: String(promo._id),
    description: promo.description || "",
    error: null,
    ...meta,
  };
}

function publicListingQuery(now = new Date()) {
  return {
    isActive: true,
    $and: [
      { $or: [{ startsAt: null }, { startsAt: { $exists: false } }, { startsAt: { $lte: now } }] },
      { $or: [{ endsAt: null }, { endsAt: { $exists: false } }, { endsAt: { $gte: now } }] },
    ],
  };
}

async function filterPublicPromosForUser(promoRows, userId) {
  if (userId == null || !Number.isInteger(userId) || userId <= 0) return promoRows;
  if (!promoRows.length) return promoRows;

  const codes = [...new Set(promoRows.map((r) => r.code).filter(Boolean))];
  const agg = await Order.aggregate([
    { $match: { userId, promoCode: { $in: codes }, status: { $ne: "cancelled" } } },
    { $group: { _id: "$promoCode", n: { $sum: 1 } } },
  ]);
  const usedMap = new Map(agg.map((x) => [x._id, x.n]));

  return promoRows.filter((r) => {
    const lim = getEffectivePerUserUsageLimit(r);
    if (lim == null) return true;
    return (usedMap.get(r.code) || 0) < lim;
  });
}

module.exports = {
  PromoCode,
  roundMoney,
  normalizeCode,
  getEffectivePerUserUsageLimit,
  computeDiscountFromPromo,
  resolvePromoForOrder,
  publicListingQuery,
  filterPublicPromosForUser,
  countUserRedemptions,
  getPromoCheckoutMeta,
};
