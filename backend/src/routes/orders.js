const express = require("express");
const authenticate = require("../middlewares/authenticate");
const createCodOrder = require("../controllers/orders/createCodOrder");

const router = express.Router();

router.use(authenticate);
router.post("/cod", createCodOrder);

module.exports = router;
