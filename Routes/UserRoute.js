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
router.post('/auth/forgot-password', authcontroller.forgotPassword);
router.post('//auth/reset-password/:token', authcontroller.resetPassword);


module.exports = router;