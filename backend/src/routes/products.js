const express = require("express");
const getProducts = require("../controllers/products/getProducts");
const getProductById = require("../controllers/products/getProductById");
const createProduct = require("../controllers/products/createProduct");
const updateProductById = require("../controllers/products/updateProductById");
const deleteProductById = require("../controllers/products/deleteProductById");
const authenticate = require("../middlewares/authenticate");
const requireAdmin = require("../middlewares/requireAdmin");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", authenticate, requireAdmin, createProduct);
router.put("/:id", authenticate, requireAdmin, updateProductById);
router.delete("/:id", authenticate, requireAdmin, deleteProductById);

module.exports = router;
