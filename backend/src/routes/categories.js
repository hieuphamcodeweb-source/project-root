const express = require("express");
const getCategories = require("../controllers/categories/getCategories");
const getCategoryById = require("../controllers/categories/getCategoryById");
const createCategory = require("../controllers/categories/createCategory");
const updateCategoryById = require("../controllers/categories/updateCategoryById");
const deleteCategoryById = require("../controllers/categories/deleteCategoryById");
const authenticate = require("../middlewares/authenticate");
const requireAdmin = require("../middlewares/requireAdmin");

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", authenticate, requireAdmin, createCategory);
router.put("/:id", authenticate, requireAdmin, updateCategoryById);
router.delete("/:id", authenticate, requireAdmin, deleteCategoryById);

module.exports = router;
