const express = require("express");
const login = require("../controllers/auth/login");
const register = require("../controllers/auth/register");
const getMe = require("../controllers/auth/getMe");
const addMyAddress = require("../controllers/auth/addMyAddress");
const updateMyAddress = require("../controllers/auth/updateMyAddress");
const deleteMyAddress = require("../controllers/auth/deleteMyAddress");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", authenticate, getMe);
router.post("/me/addresses", authenticate, addMyAddress);
router.put("/me/addresses/:addressId", authenticate, updateMyAddress);
router.delete("/me/addresses/:addressId", authenticate, deleteMyAddress);

module.exports = router;
