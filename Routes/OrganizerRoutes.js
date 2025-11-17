import express from "express";
import {
  createOrganizerProfile,
  updateOrganizerProfile,
  uploadVerificationDocs,
  getMyOrganizerProfile,
  getOrganizerEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../Controller/OrganizerController.js";

import { checkRole } from "../Middlewear/role.js";

const router = express.Router();


router.post("/create-profile", checkRole("organizer"), createOrganizerProfile);
router.get("/me", checkRole("organizer"), getMyOrganizerProfile);
router.put("/update-profile", checkRole("organizer"), updateOrganizerProfile);

// Upload verification docs (PDF, Images etc.)
router.post("/verification-docs", checkRole("organizer"), uploadVerificationDocs);


router.get("/events", checkRole("organizer"), getOrganizerEvents);
router.post("/event", checkRole("organizer"), createEvent);
router.put("/event/:eventId", checkRole("organizer"), updateEvent);
router.delete("/event/:eventId", checkRole("organizer"), deleteEvent);

export default router;
