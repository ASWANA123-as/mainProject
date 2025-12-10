const Attendee = require("../Modal/AttandeeModal");
const PDFDocument = require("pdfkit");
const Loyalty =require("../Modal/Loyalty")
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




const downloadTicket = async (req, res) => {
  try {
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=ticket.pdf");

    doc.pipe(res);
     const userId = req.user.id;
  const eventId = req.params.eventId;

    doc.fontSize(26).text("Event Ticket", { align: "center" });
      doc.moveDown();
      doc.fontSize(16).text(`User ID: ${userId}`);
      doc.text(`Event ID: ${eventId}`);
     

      doc.moveDown();
      doc.text("Thank you for registering!", { align: "center" });


    doc.end();

  } catch (error) {
    console.error("PDF ERROR:", error);
    res.status(500).send("PDF Error");
  }
};


const generateTicketPDF = async (userId, eventId) => {
  return new Promise((resolve, reject) => {
    try {
      const PDFDocument = require("pdfkit");
      const doc = new PDFDocument();
      let chunks = [];

      // --- FIX: PIPE PDF OUTPUT ----
      const stream = doc.pipe(new require("stream").PassThrough());

      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", reject);

      // --- PDF CONTENT ---
      doc.fontSize(26).text("Event Ticket", { align: "center" });
      doc.moveDown();
      doc.fontSize(16).text(`User ID: ${userId}`);
      doc.text(`Event ID: ${eventId}`);
     

      doc.moveDown();
      doc.text("Thank you for registering!", { align: "center" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
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
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("created_by", "name email") // optional
      .sort({ date: 1 });                    // upcoming first

    return res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch events",
      error: error.message,
    });
  }
}

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
  console.log(req,'uuu')
  try {
    console.log("BODY:", req.body);
console.log("HEADERS:", req.headers["content-type"]);

    const { points } = req.body;

    if (typeof points !== "number") {
      return res.status(400).json({ message: "Points must be a number" });
    }

    let loyalty = await Loyalty.findOne({ userId: req.user.id });
console.log(loyalty,'yyyy')
    if (!loyalty) {
      loyalty = new Loyalty({
        userId: req.user.id,
        points: points,
      });
    } else {
      loyalty.points += points;
    }

    await loyalty.save();

    res.status(200).json({
      message: "Loyalty points updated",
      points: loyalty.points,
    });

  } catch (error) {
    console.error("Loyalty Update Error:", error);
    res.status(500).json({ message: "Error updating loyalty points" });
  }
};


const getLoyaltyPoints = async (req, res) => {
  console.log(req,'yyy')
  try {
    const attendee = await Attendee.findOne({ user_id: req.user.id }); 

    const loyalty=await Loyalty.findOne({ userId: req.user.id })

    if (!attendee) {
      return res.status(404).json({ success: false, message: "Attendee profile not found" });
    }

    return res.status(200).json({
      success: true,
      loyaltyPoints: loyalty.points
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch loyalty points"
    });
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
  getAllEvents,
  downloadTicket,
  getLoyaltyPoints
  
  
};
