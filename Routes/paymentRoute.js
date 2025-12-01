const express = require("express");
const router = express.Router();
const { createCheckoutSession } = require("../Controller/PaymentController");
const { checkRole } = require("../Middlewear/role");
const { authuser, authorizeRoles } = require("../Middlewear/auth.js");
router.post("/pay", authuser, authorizeRoles("attendee"), createCheckoutSession);

module.exports = router;
