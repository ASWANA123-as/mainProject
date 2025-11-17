const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  role_level: { 
    type: String, 
    enum: ["super_admin", "moderator"], 
    default: "moderator"
  },

  permissions: {
    type: [String],
    default: ["manage_users", "manage_events", "view_reports"]
  }
});

module.exports = mongoose.model("Admin", adminSchema);
