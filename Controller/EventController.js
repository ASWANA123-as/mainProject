const Event = require("../Modal/EventModal");
const Organizer = require("../Modal/OrganizerModal");

// Create Event (Organizer)
exports.createEvent = async (req, res) => {
  try {
    const organizerId = req.user.id; // coming from auth middleware
    const {
      title,
      description,
      date,
      location,
      price,
      category,
      max_attendees
    } = req.body;

    if (!title || !date || !location) {
      return res.status(400).json({ message: "Title, date, and location are required" });
    }

    const newEvent = await Event.create({
      organizer_id: organizerId,
      title,
      description,
      date,
      location,
      price,
      category,
      max_attendees
    });

    // Update organizer's total event count
    await Organizer.findOneAndUpdate(
      { user_id: organizerId },
      { $inc: { total_events: 1 } }
    );

    return res.status(201).json({
      message: "Event created successfully. Waiting for admin approval.",
      event: newEvent,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Update Event (Organizer)
exports.updateEvent = async (req, res) => {
  try {
    const organizerId = req.user.id;
    const { eventId } = req.params;

    const event = await Event.findOne({
      _id: eventId,
      organizer_id: organizerId
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found or unauthorized" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, {
      new: true,
    });

    return res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Delete Event (Organizer)
exports.deleteEvent = async (req, res) => {
  try {
    const organizerId = req.user.id;
    const { eventId } = req.params;

    const event = await Event.findOne({
      _id: eventId,
      organizer_id: organizerId,
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found or unauthorized" });
    }

    await Event.findByIdAndDelete(eventId);

    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Get All Events of Organizer
exports.getOrganizerEvents = async (req, res) => {
  try {
    const organizerId = req.user.id;

    const events = await Event.find({ organizer_id: organizerId }).sort({ date: -1 });

    return res.status(200).json(events);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Get Event By ID (Public)
exports.getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId).populate("organizer_id", "company_name");

    if (!event) return res.status(404).json({ message: "Event not found" });

    return res.status(200).json(event);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Get All Events (Public)
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" }).sort({ date: 1 });

    return res.status(200).json(events);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Update Event Status (Admin)
exports.updateEventStatus = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status } = req.body; // "approved" or "rejected"

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const event = await Event.findByIdAndUpdate(
      eventId,
      { status },
      { new: true }
    );

    if (!event) return res.status(404).json({ message: "Event not found" });

    return res.status(200).json({
      message: `Event ${status} successfully`,
      event,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
