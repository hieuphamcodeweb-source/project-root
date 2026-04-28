const { User, getNextUserId, isDbConnected } = require("../../services/userService");

const allowedRoles = new Set(["Staff", "Admin", "Member"]);
const allowedStatuses = new Set(["active", "inactive", "pending", "banned"]);

async function createUser(req, res) {
  if (!isDbConnected()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  const { username, dateRegistered, role, status } = req.body;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ message: "username is required." });
  }

  if (!dateRegistered || typeof dateRegistered !== "string") {
    return res.status(400).json({ message: "dateRegistered is required." });
  }

  if (!allowedRoles.has(role)) {
    return res.status(400).json({ message: "role is invalid." });
  }

  if (!allowedStatuses.has(status)) {
    return res.status(400).json({ message: "status is invalid." });
  }

  try {
    const newUser = await User.create({
      id: await getNextUserId(),
      username: username.trim(),
      dateRegistered,
      role,
      status,
    });

    return res.status(201).json({
      message: "User created successfully.",
      data: newUser.toObject(),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create user.", error: error.message });
  }
}

module.exports = createUser;
