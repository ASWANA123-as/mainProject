import express from "express";
import { 
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
  getAllEvents,
  getOrganizerEvents,
  updateEventStatus
} from "../Controller/EventController.js";

import { checkRole } from "../Middlewear/role.js";

const router = express.Router();

// Organizer: Create event
router.post("/create", checkRole("organizer"), createEvent);

// Organizer: Update event
router.put("/update/:eventId", checkRole("organizer"), updateEvent);

// Organizer: Delete event
router.delete("/delete/:eventId", checkRole("organizer"), deleteEvent);

// Organizer: All their events
router.get("/my-events", checkRole("organizer"), getOrganizerEvents);

// Public: Get single event
router.get("/:eventId", getEventById);

// Public: Get all events
router.get("/", getAllEvents);

// Admin: Update event status (approve/reject)
router.patch("/status/:eventId", checkRole("admin"), updateEventStatus);

export default router;
