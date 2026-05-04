const { verifyToken } = require("../services/authService");

/** Sets req.auth when Bearer token is valid; otherwise req.auth = null (no 401). */
function optionalAuthenticate(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    req.auth = null;
    return next();
  }

  const payload = verifyToken(token);
  if (!payload) {
    req.auth = null;
    return next();
  }

  const userId = Number(payload.userId);
  if (!Number.isInteger(userId) || userId <= 0) {
    req.auth = null;
    return next();
  }

  req.auth = { ...payload, userId };
  return next();
}

module.exports = optionalAuthenticate;
