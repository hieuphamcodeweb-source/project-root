/** Chuỗi 24 hex = MongoDB ObjectId; còn lại coi là mã đơn hàng (orderCode). */
function isMongoObjectIdString(s) {
  return typeof s === "string" && /^[a-fA-F0-9]{24}$/.test(s);
}

function resolveOrderLookup(param) {
  const raw = String(param || "").trim();
  if (!raw) return null;
  if (isMongoObjectIdString(raw)) return { _id: raw };
  return { orderCode: raw.toUpperCase() };
}

module.exports = { resolveOrderLookup, isMongoObjectIdString };
