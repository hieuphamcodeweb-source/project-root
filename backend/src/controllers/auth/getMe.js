const User = require("../../models/User");

async function getMe(req, res) {
  try {
    const userId = Number(req.auth?.userId);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({ message: "Invalid user in token. Please login again." });
    }

    const user = await User.findOne({ id: userId }).select("-password").lean();
    if (!user) {
      return res.status(404).json({ message: "Account not found." });
    }

    return res.status(200).json({
      message: "OK",
      data: {
        id: user.id,
        username: user.username,
        dateRegistered: user.dateRegistered,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        addresses: Array.isArray(user.addresses) ? user.addresses : [],
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load profile.", error: error.message });
  }
}

module.exports = getMe;
