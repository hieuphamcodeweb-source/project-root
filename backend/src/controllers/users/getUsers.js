const { User, isDbConnected } = require("../../services/userService");

async function getUsers(req, res) {
  if (!isDbConnected()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const users = await User.find().sort({ id: -1 }).lean();

    return res.status(200).json({
      data: users,
      total: users.length,
      page: 1,
      pageSize: users.length,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users.", error: error.message });
  }
}

module.exports = getUsers;
