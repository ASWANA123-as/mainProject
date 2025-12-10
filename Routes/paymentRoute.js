const express = require("express");
const router = express.Router();
const { createCheckoutSession,verifyPaymentAndRegister } = require("../Controller/PaymentController");
const { checkRole } = require("../Middlewear/role");
const { authuser, authorizeRoles } = require("../Middlewear/auth.js");
router.post("/pay", authuser, authorizeRoles("attendee"), createCheckoutSession);


router.post("/payments/create-checkout-session/:eventId",  authuser, authorizeRoles("attendee"), createCheckoutSession);
router.get("/payments/verify", authuser, authorizeRoles("attendee"), verifyPaymentAndRegister);

module.exports = router;


