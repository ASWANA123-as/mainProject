const express = require('express');
const router = express.Router();

const authcontroller = require('../Controller/UserController');
const { authuser, authorizeRoles } = require('../Middlewear/auth');

// Register
router.post('/register', authcontroller.createuser);

// Login
router.post('/login', authcontroller.loginUser);

// Logout
router.post('/logout', authcontroller.logoutuser);

module.exports = router;