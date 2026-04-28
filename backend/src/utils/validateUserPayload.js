const allowedRoles = new Set(["Staff", "Admin", "Member"]);
const allowedStatuses = new Set(["active", "inactive", "pending", "banned"]);

function validateUserPayload(payload) {
  const { username, dateRegistered, role, status } = payload;

  if (!username || typeof username !== "string") {
    return "username is required.";
  }

  if (!dateRegistered || typeof dateRegistered !== "string") {
    return "dateRegistered is required.";
  }

  if (!allowedRoles.has(role)) {
    return "role is invalid.";
  }

  if (!allowedStatuses.has(status)) {
    return "status is invalid.";
  }

  return null;
}

module.exports = validateUserPayload;
