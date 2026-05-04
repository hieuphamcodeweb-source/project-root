const crypto = require("crypto");
const User = require("../../models/User");
const { pickSavedAddressBody, validateSavedAddressPayload, applyDefaultFlags } = require("../../utils/savedAddress");

async function addMyAddress(req, res) {
  try {
    const userId = Number(req.auth?.userId);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({ message: "Invalid user in token. Please login again." });
    }

    const payload = pickSavedAddressBody(req.body);
    const validationError = validateSavedAddressPayload(payload);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const user = await User.findOne({ id: userId }).select("addresses");
    if (!user) {
      return res.status(404).json({ message: "Account not found." });
    }

    const addresses = [...(user.addresses || [])];
    const wasEmpty = addresses.length === 0;
    const newAddress = {
      id: crypto.randomUUID(),
      label: payload.label,
      recipientName: payload.recipientName,
      phone: payload.phone,
      street: payload.street,
      ward: payload.ward,
      district: payload.district,
      province: payload.province,
      isDefault: false,
    };

    addresses.push(newAddress);
    const preferNewAsDefault = payload.isDefault || wasEmpty;
    const next = applyDefaultFlags(addresses, preferNewAsDefault ? newAddress.id : null);

    await User.updateOne({ id: userId }, { $set: { addresses: next } });

    const saved = next.find((a) => a.id === newAddress.id);
    return res.status(201).json({ message: "Address saved.", data: saved });
  } catch (error) {
    return res.status(500).json({ message: "Failed to save address.", error: error.message });
  }
}

module.exports = addMyAddress;
