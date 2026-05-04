function parseOptionalNumber(value, { allowNull = true, min, name }) {
  if (value === undefined || value === null || value === "") {
    if (allowNull) return { ok: true, value: null };
    return { ok: false, error: `${name} is required.` };
  }
  const n = Number(value);
  if (!Number.isFinite(n)) {
    return { ok: false, error: `${name} must be a number.` };
  }
  if (min !== undefined && n < min) {
    return { ok: false, error: `${name} must be at least ${min}.` };
  }
  return { ok: true, value: n };
}

function parseOptionalDateField(value, fieldName) {
  if (value === undefined || value === null || value === "") {
    return { ok: true, value: null };
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    return { ok: false, error: `${fieldName} is not a valid date.` };
  }
  return { ok: true, value: d };
}

function validatePromoCodePayload(body) {
  if (!body || typeof body !== "object") {
    return { error: "Invalid body." };
  }

  const code = String(body.code || "").trim();
  if (!code) return { error: "code is required." };
  if (code.length < 2) return { error: "code must be at least 2 characters." };

  const discountType = body.discountType;
  if (discountType !== "percent" && discountType !== "fixed") {
    return { error: "discountType must be percent or fixed." };
  }

  const valueNum = Number(body.value);
  if (!Number.isFinite(valueNum) || valueNum <= 0) {
    return { error: "value must be a positive number." };
  }
  if (discountType === "percent" && valueNum > 100) {
    return { error: "Percent value cannot exceed 100." };
  }

  let minOrderAmount = 0;
  if (body.minOrderAmount !== undefined && body.minOrderAmount !== null && body.minOrderAmount !== "") {
    const minOrder = parseOptionalNumber(body.minOrderAmount, { allowNull: false, min: 0, name: "minOrderAmount" });
    if (!minOrder.ok) return { error: minOrder.error };
    minOrderAmount = minOrder.value;
  }

  let maxDiscountAmount = null;
  if (discountType === "percent") {
    if (body.maxDiscountAmount !== undefined && body.maxDiscountAmount !== null && body.maxDiscountAmount !== "") {
      const cap = parseOptionalNumber(body.maxDiscountAmount, { allowNull: false, min: 0, name: "maxDiscountAmount" });
      if (!cap.ok) return { error: cap.error };
      maxDiscountAmount = cap.value;
    }
  }

  const isActive = body.isActive === undefined ? true : Boolean(body.isActive);

  let perUserUsageLimit = null;
  const rawPerUser =
    body.perUserUsageLimit !== undefined && body.perUserUsageLimit !== null && body.perUserUsageLimit !== ""
      ? body.perUserUsageLimit
      : body.usageLimit;
  if (rawPerUser !== undefined && rawPerUser !== null && rawPerUser !== "") {
    const lim = parseOptionalNumber(rawPerUser, { allowNull: false, min: 1, name: "perUserUsageLimit" });
    if (!lim.ok) return { error: lim.error };
    perUserUsageLimit = lim.value;
  }

  const starts = parseOptionalDateField(body.startsAt, "startsAt");
  if (!starts.ok) return { error: starts.error };
  const ends = parseOptionalDateField(body.endsAt, "endsAt");
  if (!ends.ok) return { error: ends.error };

  if (starts.value && ends.value && starts.value > ends.value) {
    return { error: "startsAt must be before endsAt." };
  }

  return {
    data: {
      code: code.toUpperCase(),
      description: String(body.description ?? "").trim(),
      discountType,
      value: valueNum,
      minOrderAmount,
      maxDiscountAmount,
      isActive,
      perUserUsageLimit,
      usageLimit: null,
      startsAt: starts.value,
      endsAt: ends.value,
    },
  };
}

module.exports = validatePromoCodePayload;
