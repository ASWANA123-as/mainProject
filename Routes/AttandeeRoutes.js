import express from "express";
import {
  createAttendeeProfile,
  getMyAttendeeProfile,
  updatePreferences,
  getRegisteredEvents,
  registerForEvent,
  unregisterEvent,
  addLoyaltyPoints,
} from "../Controller/AttendeeController.js";

import { checkRole } from "../Middlewear/role.js";

const router = express.Router();

router.post("/create-profile", checkRole("attendee"), createAttendeeProfile);
router.get("/me", checkRole("attendee"), getMyAttendeeProfile);
router.patch("/preferences", checkRole("attendee"), updatePreferences);


router.get("/my-events", checkRole("attendee"), getRegisteredEvents);
router.post("/register/:eventId", checkRole("attendee"), registerForEvent);
router.delete("/unregister/:eventId", checkRole("attendee"), unregisterEvent);


router.patch("/loyalty/add", checkRole("attendee"), addLoyaltyPoints);

export default router;
