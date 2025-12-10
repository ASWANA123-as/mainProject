require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Modal/UserModal');
const Organizer = require('../Modal/OrganizerModal');
const Attendee = require('../Modal/AttandeeModal');
const Admin = require('../Modal/AdminModal');

// CREATE USER
exports.createuser = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password_hash, 
      role, 
      status, 
      organization_name, 
      contact_number, 
      interests 
    } = req.body;

    // Required fields
    if (!name || !email || !password_hash || !role) {
      return res.status(400).json({ message: "Name, email, password, and role are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password_hash, 10);

    // Create base user
    const newUser = await User.create({
      name,
      email,
      password_hash: hashedPassword,
      role,
      status: status || "active",
    });

    // ROLE BASED COLLECTIONS
    if (role === "organizer") {
      await Organizer.create({
        user_id: newUser._id,
        organization_name,
        contact_number,
        verification_status: "pending",
      });
    }

    if (role === "attendee") {
      await Attendee.create({
        user_id: newUser._id,
        interests: interests || [],
        events_registered: []
      });
    }

    if (role === "admin") {
      await Admin.create({
        user_id: newUser._id,
        permissions: ["manage_users", "manage_events", "view_reports"]
      });
    }

    res.status(201).json({
      message: `${role} registered successfully`,
      user: newUser,
    });

  } catch (err) {
    console.error("User creation error:", err);
    res.status(500).json({ message: err.message });
  }
};


// LOGIN USER
exports.loginUser = async (req, res) => {
  console.log(req.body,'iiii')
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
console.log(user,'user')
    if (!user) return res.status(400).json({ message: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        userType: user.role,
        email: user.email
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      userType: user.role,
      email: user.email,
      firstname: user.name,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// LOGOUT USER
exports.logoutuser = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
