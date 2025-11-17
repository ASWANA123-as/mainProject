const express = require("express");
const { 
  getOrganizers,
  verifyOrganizer,
  getDashboardStats 
} = require("../Controller/AdminController.js");

const { checkRole } = require("../Middlewear/role.js");

const router = express.Router();

// Get all organizers with optional ?status=pending
router.get("/organizers", checkRole("admin"), getOrganizers);

// Approve / Reject organizer
router.patch("/verify-organizer/:id", checkRole("admin"), verifyOrganizer);

// Admin dashboard stats
router.get("/analytics", checkRole("admin"), getDashboardStats);

module.exports = router;
