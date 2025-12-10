const express = require("express");
const {
  createAttendeeProfile,
  getMyAttendeeProfile,
  updatePreferences,
  getRegisteredEvents,
  registerForEvent,
  unregisterEvent,
  addLoyaltyPoints,
  getAllEvents,
  downloadTicket,
  getLoyaltyPoints
} = require("../Controller/AttandeeController");

const { checkRole } = require("../Middlewear/role");
const { authuser, authorizeRoles } = require("../Middlewear/auth.js");


const router = express.Router();

// Create attendee profile
router.post("/create-profile", authuser, authorizeRoles("attendee"), createAttendeeProfile);

// Get my profile
router.get("/me",authuser, authorizeRoles("attendee"), getMyAttendeeProfile);

// Update preferences
router.patch("/preferences", authuser, authorizeRoles("attendee"), updatePreferences);

// Registered events
router.get("/my-events",authuser, authorizeRoles("attendee"), getRegisteredEvents);

// Register for event
router.post("/register/:eventId", authuser, authorizeRoles("attendee"), registerForEvent);

// Unregister from event
router.delete("/unregister/:eventId", authuser, authorizeRoles("attendee"), unregisterEvent);

// Add loyalty points
router.patch("/loyalty/add", authuser, authorizeRoles("attendee"), addLoyaltyPoints);

router.get(
  "/events/all",
  authuser,
  authorizeRoles("attendee"),
  getAllEvents
);
router.get("/ticket/:eventId", authuser, authorizeRoles("attendee"), downloadTicket);
router.get(
  "/loyalty",
  authuser,
  authorizeRoles("attendee"),
  getLoyaltyPoints
);

module.exports = router;
