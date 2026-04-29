const { registerAccount } = require("../../services/authService");

async function register(req, res) {
  const username = String(req.body?.username || "").trim();
  const password = String(req.body?.password || "").trim();
  const role = req.body?.role === "admin" ? "admin" : "user";

  if (username.length < 3) {
    return res.status(400).json({ message: "username must be at least 3 characters." });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "password must be at least 6 characters." });
  }

  try {
    const result = await registerAccount({ username, password, role });
    if (result.error) {
      return res.status(409).json({ message: result.error });
    }

    return res.status(201).json({
      message: "Register successfully.",
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({ message: "Register failed.", error: error.message });
  }
}

module.exports = register;
