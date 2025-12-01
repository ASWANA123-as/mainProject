const Attendee = require("../Modal/AttandeeModal");
const Event = require("../Modal/EventModal");

// -------------------------------------------
// CREATE ATTENDEE PROFILE
// -------------------------------------------
const createAttendeeProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Ensure user does not create profile twice
    const existing = await Attendee.findOne({ user_id: userId });
    if (existing) {
      return res.status(400).json({ message: "Attendee profile already exists" });
    }

    const attendee = await Attendee.create({
      user_id: userId,
      preferences: req.body.preferences || [],
    });

    res.status(201).json({
      message: "Attendee profile created successfully",
      attendee,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating attendee profile", error });
  }
};

// -------------------------------------------
// GET MY PROFILE
// -------------------------------------------
const getMyAttendeeProfile = async (req, res) => {
  try {
    const attendee = await Attendee.findOne({ user_id: req.user.id })
      .populate("user_id", "name email")
      .populate("last_attended_event_id", "title date time location");

    if (!attendee) {
      return res.status(404).json({ message: "Attendee profile not found" });
    }

    res.status(200).json(attendee);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendee profile", error });
  }
};

// -------------------------------------------
// UPDATE PREFERENCES
// -------------------------------------------
const updatePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;

    if (!Array.isArray(preferences)) {
      return res.status(400).json({ message: "Preferences must be an array" });
    }

    const attendee = await Attendee.findOneAndUpdate(
      { user_id: req.user.id },
      { preferences },
      { new: true }
    );

    if (!attendee) {
      return res.status(404).json({ message: "Attendee profile not found" });
    }

    res.status(200).json({
      message: "Preferences updated successfully",
      attendee,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating preferences", error });
  }
};

// -------------------------------------------
// REGISTER FOR EVENT
// -------------------------------------------
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    console.log(event,'event')
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Prevent duplicate registration
    if (event?.attendees.includes(req.user.id)) {
      return res.status(400).json({ message: "Already registered for this event" });
    }

    event.attendees.push(req.user.id);
    await event.save();

    // Update last attended event
    await Attendee.findOneAndUpdate(
      { user_id: req.user.id },
      { last_attended_event_id: eventId },
      { new: true }
    );

    res.status(200).json({ message: "Registered successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Error registering for event", error });
  }
};

// -------------------------------------------
// UNREGISTER FROM EVENT
// -------------------------------------------
const unregisterEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    await Event.findByIdAndUpdate(
      eventId,
      { $pull: { attendees: req.user.id } },
      { new: true }
    );

    res.status(200).json({ message: "Unregistered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error unregistering event", error });
  }
};

// -------------------------------------------
// GET EVENTS USER REGISTERED FOR
// -------------------------------------------
const getRegisteredEvents = async (req, res) => {
  try {
    const events = await Event.find({ attendees: req.user.id });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching registered events", error });
  }
};

// -------------------------------------------
// ADD LOYALTY POINTS
// -------------------------------------------
const addLoyaltyPoints = async (req, res) => {
  try {
    const { points } = req.body;

    if (!points || typeof points !== "number") {
      return res.status(400).json({ message: "Points must be a number" });
    }

    const attendee = await Attendee.findOneAndUpdate(
      { user_id: req.user.id },
      { $inc: { loyalty_points: points } },
      { new: true }
    );

    if (!attendee) {
      return res.status(404).json({ message: "Attendee profile not found" });
    }

    res.status(200).json({
      message: "Loyalty points added",
      attendee,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating loyalty points", error });
  }
};

// -------------------------------------------
// EXPORTS
// -------------------------------------------
module.exports = {
  createAttendeeProfile,
  getMyAttendeeProfile,
  updatePreferences,
  getRegisteredEvents,
  registerForEvent,
  unregisterEvent,
  addLoyaltyPoints,
};
