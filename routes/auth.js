const authController = require("../controller/authController.js");
const express = require("express");
const router = express.Router();

// sending verification code to email (API)
router.post("/send/email", authController.sendVerificationCode);
// verify the code is correct (API)
router.post("/verify/email", authController.VerificationCode);

module.exports = router;