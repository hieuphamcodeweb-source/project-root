const express = require("express");
const authenticate = require("../middlewares/authenticate");
const getMyCart = require("../controllers/cart/getMyCart");
const updateMyCart = require("../controllers/cart/updateMyCart");

const router = express.Router();

router.use(authenticate);
router.get("/me", getMyCart);
router.put("/me", updateMyCart);

module.exports = router;
