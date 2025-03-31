const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);  // Register User
router.post("/login", loginUser);  // Login User

module.exports = router;
