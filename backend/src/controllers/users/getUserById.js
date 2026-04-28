const { User, isDbConnected } = require("../../services/userService");

async function getUserById(req, res) {
  if (!isDbConnected()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  const userId = Number(req.params.id);
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ message: "Invalid user id." });
  }

  try {
    const user = await User.findOne({ id: userId }).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user.", error: error.message });
  }
}

module.exports = getUserById;
