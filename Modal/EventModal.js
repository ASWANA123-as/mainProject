const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  time: String,
  venue: String,
  category: String,
  banner_image: String,
  max_attendees: Number,
  ticket_price: Number,
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["pending", "approved"], default: "pending" },
  attendees:[]
});

module.exports = mongoose.model("Event", EventSchema);
