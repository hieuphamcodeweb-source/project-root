const express = require("express");
const login = require("../controllers/auth/login");
const register = require("../controllers/auth/register");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);

module.exports = router;
