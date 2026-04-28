const { User, getNextUserId, isDbConnected } = require("../../services/userService");
const validateUserPayload = require("../../utils/validateUserPayload");

async function createUser(req, res) {
  if (!isDbConnected()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  const validationError = validateUserPayload(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const { username, dateRegistered, role, status } = req.body;
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
