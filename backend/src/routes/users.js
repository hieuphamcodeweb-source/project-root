const express = require("express");
const getUsers = require("../controllers/users/getUsers");
const getUserById = require("../controllers/users/getUserById");
const createUser = require("../controllers/users/createUser");
const updateUserById = require("../controllers/users/updateUserById");
const deleteUser = require("../controllers/users/deleteUser");
const authenticate = require("../middlewares/authenticate");
const requireAdmin = require("../middlewares/requireAdmin");

const router = express.Router();
router.use(authenticate, requireAdmin);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUserById);
router.delete("/:id", deleteUser);

module.exports = router;
