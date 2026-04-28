const express = require("express");
const getCategories = require("../controllers/categories/getCategories");
const getCategoryById = require("../controllers/categories/getCategoryById");
const createCategory = require("../controllers/categories/createCategory");
const updateCategoryById = require("../controllers/categories/updateCategoryById");
const deleteCategoryById = require("../controllers/categories/deleteCategoryById");

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", createCategory);
router.put("/:id", updateCategoryById);
router.delete("/:id", deleteCategoryById);

module.exports = router;
