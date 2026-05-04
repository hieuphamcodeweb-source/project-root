const User = require("../../models/User");
const { pickSavedAddressBody, validateSavedAddressPayload, applyDefaultFlags } = require("../../utils/savedAddress");

async function updateMyAddress(req, res) {
  try {
    const userId = Number(req.auth?.userId);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({ message: "Invalid user in token. Please login again." });
    }

    const addressId = String(req.params.addressId || "").trim();
    if (!addressId) {
      return res.status(400).json({ message: "Address id is required." });
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
    const index = addresses.findIndex((a) => a.id === addressId);
    if (index < 0) {
      return res.status(404).json({ message: "Address not found." });
    }

    addresses[index] = {
      ...addresses[index],
      label: payload.label,
      recipientName: payload.recipientName,
      phone: payload.phone,
      street: payload.street,
      ward: payload.ward,
      district: payload.district,
      province: payload.province,
    };

    const next = applyDefaultFlags(addresses, payload.isDefault ? addressId : null);

    await User.updateOne({ id: userId }, { $set: { addresses: next } });

    const saved = next.find((a) => a.id === addressId);
    return res.status(200).json({ message: "Address updated.", data: saved });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update address.", error: error.message });
  }
}

module.exports = updateMyAddress;
