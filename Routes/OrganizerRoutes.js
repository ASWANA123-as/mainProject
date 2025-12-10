const express = require("express");
const upload = require('../Middlewear/Upload');
const { authuser, authorizeRoles } = require("../Middlewear/auth.js");

const {
  createOrganizerProfile,
  updateOrganizerProfile,
  uploadVerificationDocs,
  getMyOrganizerProfile,
  getOrganizerEvents,
  createEvent,
  updateEvent,
  deleteEvent,getSingleEvent
} = require("../Controller/OrganizerController");

const { checkRole } = require("../Middlewear/role");

const router = express.Router();

// Organizer profile routes
router.put

("/create-profile",authuser, authorizeRoles("organizer"), createOrganizerProfile);
router.get("/me",authuser, authorizeRoles("organizer"), getMyOrganizerProfile);
router.put("/update-profile", authuser, authorizeRoles("organizer"), updateOrganizerProfile);

// Upload verification docs
router.post(
  "/verification-docs",
  authuser, authorizeRoles("organizer"),
  upload.any(), // allow multiple files
  uploadVerificationDocs
);

// Event routes
router.get("/events", authuser, authorizeRoles("organizer"), getOrganizerEvents);
router.post("/event", authuser, authorizeRoles("organizer"), createEvent);
router.put("/event/:eventId",authuser, authorizeRoles("organizer"), updateEvent);
router.delete("/event/:eventId", authuser, authorizeRoles("organizer"), deleteEvent);
router.get(
  "/event/:eventId",
  authuser,
  authorizeRoles("organizer"),
  getSingleEvent
);


module.exports = router;
