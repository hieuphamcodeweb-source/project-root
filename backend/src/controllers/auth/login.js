const { createToken, findAccount } = require("../../services/authService");

async function login(req, res) {
  const username = String(req.body?.username || "").trim();
  const password = String(req.body?.password || "").trim();

  if (!username || !password) {
    return res.status(400).json({ message: "username and password are required." });
  }

  const account = await findAccount(username, password);
  if (!account) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const token = createToken(account);

  return res.status(200).json({
    message: "Login successfully.",
    data: {
      token,
      user: {
        id: account.id,
        username: account.username,
        fullName: account.fullName,
        role: account.role,
      },
    },
  });
}

module.exports = login;
