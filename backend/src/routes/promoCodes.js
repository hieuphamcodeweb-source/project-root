const express = require("express");
const authenticate = require("../middlewares/authenticate");
const optionalAuthenticate = require("../middlewares/optionalAuthenticate");
const requireAdmin = require("../middlewares/requireAdmin");
const getPromoCodes = require("../controllers/promoCodes/getPromoCodes");
const getPromoCodeById = require("../controllers/promoCodes/getPromoCodeById");
const createPromoCode = require("../controllers/promoCodes/createPromoCode");
const updatePromoCodeById = require("../controllers/promoCodes/updatePromoCodeById");
const deletePromoCodeById = require("../controllers/promoCodes/deletePromoCodeById");
const getPublicPromoCodes = require("../controllers/promoCodes/getPublicPromoCodes");
const previewPromoCode = require("../controllers/promoCodes/previewPromoCode");

const router = express.Router();

router.post("/preview", optionalAuthenticate, previewPromoCode);
router.get("/public", optionalAuthenticate, getPublicPromoCodes);

router.get("/", authenticate, requireAdmin, getPromoCodes);
router.get("/:id", authenticate, requireAdmin, getPromoCodeById);
router.post("/", authenticate, requireAdmin, createPromoCode);
router.put("/:id", authenticate, requireAdmin, updatePromoCodeById);
router.delete("/:id", authenticate, requireAdmin, deletePromoCodeById);

module.exports = router;
