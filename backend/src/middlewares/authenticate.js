const { verifyToken } = require("../services/authService");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }

  const userId = Number(payload.userId);
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(401).json({ message: "Invalid token payload. Please login again." });
  }

  req.auth = { ...payload, userId };
  return next();
}

module.exports = authenticate;
