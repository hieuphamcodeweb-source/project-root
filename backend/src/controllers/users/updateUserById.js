const { User, isDbConnected } = require("../../services/userService");
const validateUserPayload = require("../../utils/validateUserPayload");

async function updateUserById(req, res) {
  if (!isDbConnected()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  const userId = Number(req.params.id);
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ message: "Invalid user id." });
  }

  const validationError = validateUserPayload(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const { username, dateRegistered, role, status } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.trim(),
        dateRegistered,
        role,
        status,
      },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "User updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update user.", error: error.message });
  }
}

module.exports = updateUserById;
