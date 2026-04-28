const allowedStatuses = new Set(["active", "inactive", "draft"]);

function validateCategoryPayload(payload) {
  const { categoryCode, categoryName, status, sortOrder } = payload;

  if (!categoryCode || typeof categoryCode !== "string" || categoryCode.trim().length < 2) {
    return "categoryCode is required.";
  }

  if (!categoryName || typeof categoryName !== "string" || categoryName.trim().length < 2) {
    return "categoryName is required.";
  }

  if (!allowedStatuses.has(status)) {
    return "status is invalid.";
  }

  if (!Number.isInteger(sortOrder) || sortOrder < 0) {
    return "sortOrder must be a non-negative integer.";
  }

  return null;
}

module.exports = validateCategoryPayload;
