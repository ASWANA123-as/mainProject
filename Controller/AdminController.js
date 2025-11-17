// src/controllers/admin.controller.js
const Admin = require('../Modal/AdminModal.js');
const Organizer = require('../Modal/OrganizerModal.js');

const User = require('../Modal/UserModal.js');

/**
 * @desc Get all organizers (optional filter by status)
 * @route GET /api/admin/organizers?status=pending
 */
exports.getOrganizers = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { verification_status: status } : {};

    const organizers = await Organizer.find(filter)
      .populate("user_id", "name email")
      .populate("verified_by", "user_id");

    res.json({ success: true, data: organizers });
  } catch (err) {
    console.error("Error fetching organizers:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc Approve or reject an organizer
 * @route PATCH /api/admin/verify-organizer/:id
 */
exports.verifyOrganizer = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // approve or reject

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "Invalid action type" });
    }

    const organizer = await Organizer.findById(id);
    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    organizer.verification_status =
      action === "approve" ? "approved" : "rejected";
    organizer.verified_by = req.user.id; // comes from JWT auth
    await organizer.save();

    res.json({
      success: true,
      message: `Organizer ${action}d successfully`,
      organizer,
    });
  } catch (err) {
    console.error("Error verifying organizer:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc Admin analytics dashboard
 * @route GET /api/admin/analytics
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrganizers = await Organizer.countDocuments();
    const pendingOrganizers = await Organizer.countDocuments({
      verification_status: "pending",
    });
    const totalEvents = await Event.countDocuments();
    const completedEvents = await Event.countDocuments({ status: "completed" });

    res.json({
      success: true,
      analytics: {
        totalUsers,
        totalOrganizers,
        pendingOrganizers,
        totalEvents,
        completedEvents,
      },
    });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
