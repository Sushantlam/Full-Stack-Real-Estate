const express = require("express")
const { registerUser, verifyEmail, resendVerifyLink, resetPasswordLink } = require("../controllers/user.controllers")
const router = express.Router()

router.route("/signup").post(registerUser)
router.route("/email-verify/:token").patch(verifyEmail)
router.route("/resend-otp").post(resendVerifyLink)
router.route("/reset-password").post(resetPasswordLink)

module.exports = router