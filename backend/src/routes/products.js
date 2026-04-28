const express = require("express");
const getProducts = require("../controllers/products/getProducts");
const getProductById = require("../controllers/products/getProductById");
const createProduct = require("../controllers/products/createProduct");
const updateProductById = require("../controllers/products/updateProductById");
const deleteProductById = require("../controllers/products/deleteProductById");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProductById);
router.delete("/:id", deleteProductById);

module.exports = router;
