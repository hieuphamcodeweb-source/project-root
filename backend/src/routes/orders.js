const express = require("express");
const authenticate = require("../middlewares/authenticate");
const requireAdmin = require("../middlewares/requireAdmin");
const createCodOrder = require("../controllers/orders/createCodOrder");
const getOrders = require("../controllers/orders/getOrders");
const getOrderById = require("../controllers/orders/getOrderById");
const updateOrderStatus = require("../controllers/orders/updateOrderStatus");

const router = express.Router();

router.use(authenticate);
router.post("/cod", createCodOrder);
router.get("/", requireAdmin, getOrders);
router.get("/:id", requireAdmin, getOrderById);
router.patch("/:id/status", requireAdmin, updateOrderStatus);

module.exports = router;
