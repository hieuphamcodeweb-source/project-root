function pickSavedAddressBody(body) {
  return {
    label: String(body?.label || "").trim(),
    recipientName: String(body?.recipientName || "").trim(),
    phone: String(body?.phone || "").trim(),
    street: String(body?.street || "").trim(),
    ward: String(body?.ward || "").trim(),
    district: String(body?.district || "").trim(),
    province: String(body?.province || "").trim(),
    isDefault: Boolean(body?.isDefault),
  };
}

function validateSavedAddressPayload(payload) {
  if (!payload.recipientName) {
    return "Recipient name is required.";
  }
  if (!payload.phone) {
    return "Phone is required.";
  }
  if (!payload.street) {
    return "Street / number is required.";
  }
  if (!payload.province) {
    return "Province / city is required.";
  }
  return null;
}

function applyDefaultFlags(addresses, preferredId) {
  const list = (addresses || []).map((a) => ({ ...a }));
  if (!list.length) {
    return list;
  }

  if (preferredId && list.some((a) => a.id === preferredId)) {
    for (const a of list) {
      a.isDefault = a.id === preferredId;
    }
    return list;
  }

  const currentDefaults = list.filter((a) => a.isDefault);
  if (currentDefaults.length === 1) {
    return list;
  }

  for (let i = 0; i < list.length; i += 1) {
    list[i].isDefault = i === 0;
  }
  return list;
}

module.exports = {
  pickSavedAddressBody,
  validateSavedAddressPayload,
  applyDefaultFlags,
};
