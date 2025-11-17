const mongoose = require("mongoose");

const attendeeSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    preferences: {
      type: [String],
      default: [],
    },

    loyalty_points: {
      type: Number,
      default: 0,
    },

    last_attended_event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendee", attendeeSchema);
