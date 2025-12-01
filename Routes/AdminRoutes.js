const express = require("express");
const { 
  getOrganizers,
  verifyOrganizer,
  getDashboardStats 
} = require("../Controller/AdminController.js");

const { authuser, authorizeRoles } = require("../Middlewear/auth.js");

const router = express.Router();

// Get all organizers → only admin
router.get(
  "/organizers", 
  authuser, 
  authorizeRoles("admin"),
  getOrganizers
);

// Approve / Reject organizer → only admin
router.patch(
  "/verify-organizer/:id", 
  authuser, 
  authorizeRoles("admin"),
  verifyOrganizer
);

// Admin dashboard stats → only admin
router.get(
  "/analytics", 
  authuser, 
  authorizeRoles("admin"),
  getDashboardStats
);

module.exports = router;
