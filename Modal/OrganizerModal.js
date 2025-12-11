const mongoose = require("mongoose");

const organizerSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true
  },

  company_name: { 
    type: String,
default:null
  },
  Bio:{ type: String,default:null},

  verification_status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },

  verified_by: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Admin",
    default: null 
  },

  verification_docs: [
    { 
      file_name: String, 
      url: String 
    }
  ],

  total_events: { 
    type: Number, 
    default: 0 
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Organizer", organizerSchema);
