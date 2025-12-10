const mongoose = require("mongoose");

const LoyaltySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  points: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Loyalty", LoyaltySchema);
