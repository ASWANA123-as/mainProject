const Organizer = require("../Modal/OrganizerModal.js");
const Event = require("../Modal/EventModal.js");
const User = require("../Modal/UserModal.js");
const cloudinary = require("../config/Cloudinary.js");

// ----------------------------------------------------
// CREATE ORGANIZER PROFILE
// ----------------------------------------------------
exports.createOrganizerProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // check if already exists
    const existingProfile = await Organizer.findOne({ user_id: userId });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Organizer profile already exists",
      });
    }

    const { company_name } = req.body;

    const organizer = new Organizer({
      user_id: userId,
      company_name,
    });

    await organizer.save();

    res.status(201).json({
      success: true,
      message: "Organizer profile created",
      data: organizer,
    });
  } catch (err) {
    console.error("Error creating organizer profile:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ----------------------------------------------------
// GET MY ORGANIZER PROFILE
// ----------------------------------------------------
exports.getMyOrganizerProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const organizer = await Organizer.findOne({ user_id: userId })
      .populate("user_id", "name email");

    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: "Organizer profile not found",
      });
    }

    res.json({ success: true, data: organizer });
  } catch (err) {
    console.error("Error fetching organizer profile:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ----------------------------------------------------
// UPDATE ORGANIZER PROFILE
// ----------------------------------------------------
exports.updateOrganizerProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { company_name } = req.body;

    const organizer = await Organizer.findOneAndUpdate(
      { user_id: userId },
      { company_name },
      { new: true }
    );

    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: "Organizer profile not found",
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: organizer,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ----------------------------------------------------
// UPLOAD VERIFICATION DOCUMENTS



exports.uploadVerificationDocs = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded"
      });
    }

    const uploadedDocs = [];

    // Upload each file to Cloudinary
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "organizer_docs",
      });

      uploadedDocs.push({
        file_name: file.originalname,
        url: result.secure_url,
      });
    }

    // Save uploaded documents in organizer record
    const updatedOrganizer = await Organizer.findOneAndUpdate(
      { user_id: req.user.id },
      { $push: { verification_docs: { $each: uploadedDocs } } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Documents uploaded successfully",
      uploaded_docs: uploadedDocs,
      organizer: updatedOrganizer
    });

  } catch (err) {
    console.error("Document upload error:", err);
    return res.status(500).json({
      success: false,
      message: "Upload failed",
      error: err.message
    });
  }
};
// ----------------------------------------------------
// GET ALL EVENTS CREATED BY ORGANIZER
// ----------------------------------------------------
exports.getOrganizerEvents = async (req, res) => {
  try {
    const userId = req.user.id;

    const events = await Event.find({ created_by: userId });

    res.json({ success: true, data: events });
  } catch (err) {
    console.error("Error fetching organizer events:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ----------------------------------------------------
// CREATE EVENT
// ----------------------------------------------------
exports.createEvent = async (req, res) => {
  try {
    const userId = req.user.id;

    const { title, description, date, time, venue, category, banner_image, max_attendees, ticket_price } = req.body;

    const event = new Event({
      title,
      description,
      date,
      time,
      venue,
      category,
      banner_image,
      max_attendees,
      ticket_price,
      created_by: userId,
    });

    await event.save();

    // Update organizer's total event count
    await Organizer.findOneAndUpdate(
      { user_id: userId },
      { $inc: { total_events: 1 } }
    );

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ----------------------------------------------------
// UPDATE EVENT
// ----------------------------------------------------
exports.updateEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.params;

    const event = await Event.findOneAndUpdate(
      { _id: eventId, created_by: userId },
      req.body,
      { new: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found or unauthorized",
      });
    }

    res.json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.getSingleEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch event", error });
  }
};


// ----------------------------------------------------
// DELETE EVENT
// ----------------------------------------------------
exports.deleteEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.params;

    const event = await Event.findOneAndDelete({
      _id: eventId,
      created_by: userId,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found or unauthorized",
      });
    }

    // Decrease organizer event count
    await Organizer.findOneAndUpdate(
      { user_id: userId },
      { $inc: { total_events: -1 } }
    );

    res.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
