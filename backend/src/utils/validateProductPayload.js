const allowedStatuses = new Set(["active", "inactive", "draft"]);
const imageUrlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i;

function isPositiveOrZeroNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function validateProductPayload(payload) {
  const { name, sku, category, price, stock, status, thumbnailUrl, galleryUrls } = payload;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return "name is required and must be at least 2 characters.";
  }

  if (!sku || typeof sku !== "string" || sku.trim().length < 2) {
    return "sku is required and must be at least 2 characters.";
  }

  if (!category || typeof category !== "string" || category.trim().length < 2) {
    return "category is required.";
  }

  if (!isPositiveOrZeroNumber(price)) {
    return "price must be a valid non-negative number.";
  }

  if (!Number.isInteger(stock) || stock < 0) {
    return "stock must be a non-negative integer.";
  }

  if (!allowedStatuses.has(status)) {
    return "status is invalid.";
  }

  if (!thumbnailUrl || typeof thumbnailUrl !== "string" || !imageUrlRegex.test(thumbnailUrl)) {
    return "thumbnailUrl must be a valid image URL.";
  }

  if (!Array.isArray(galleryUrls)) {
    return "galleryUrls must be an array.";
  }

  for (const url of galleryUrls) {
    if (typeof url !== "string" || !imageUrlRegex.test(url)) {
      return "Each gallery URL must be a valid image URL.";
    }
  }

  return null;
}

module.exports = validateProductPayload;
