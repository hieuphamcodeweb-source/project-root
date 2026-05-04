const User = require("../../models/User");
const { applyDefaultFlags } = require("../../utils/savedAddress");

async function deleteMyAddress(req, res) {
  try {
    const userId = Number(req.auth?.userId);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({ message: "Invalid user in token. Please login again." });
    }

    const addressId = String(req.params.addressId || "").trim();
    if (!addressId) {
      return res.status(400).json({ message: "Address id is required." });
    }

    const user = await User.findOne({ id: userId }).select("addresses");
    if (!user) {
      return res.status(404).json({ message: "Account not found." });
    }

    const addresses = [...(user.addresses || [])].filter((a) => a.id !== addressId);
    if (addresses.length === (user.addresses || []).length) {
      return res.status(404).json({ message: "Address not found." });
    }

    const next = applyDefaultFlags(addresses, null);

    await User.updateOne({ id: userId }, { $set: { addresses: next } });

    return res.status(200).json({ message: "Address removed.", data: { addresses: next } });
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove address.", error: error.message });
  }
}

module.exports = deleteMyAddress;
