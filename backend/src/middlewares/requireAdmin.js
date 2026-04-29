function requireAdmin(req, res, next) {
  if (!req.auth || req.auth.role !== "admin") {
    return res.status(403).json({ message: "Forbidden. Admin role required." });
  }
  return next();
}

module.exports = requireAdmin;
