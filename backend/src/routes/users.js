const express = require("express");
const getUsers = require("../controllers/users/getUsers");
const createUser = require("../controllers/users/createUser");
const deleteUser = require("../controllers/users/deleteUser");

const router = express.Router();
router.get("/", getUsers);
router.post("/", createUser);
router.delete("/:id", deleteUser);

module.exports = router;
