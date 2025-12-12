const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    name: String,
  email: { type: String, unique: true },
  password_hash: String,
  role: { type: String, enum: ["admin", "organizer", "attendee"] },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  resetPasswordToken: String,
  resetPasswordExpires: Date
},{ timestamps: true })



const User=mongoose.model('User',userSchema)
module.exports=User