const express = require("express");
const router = express.Router();

// import controller
const {
  signup,
  accountActivation,
  signin,
  forgotPassword,
  resetPassword,
  googleLogin,
} = require("../controllers/authController");

router.post("/signup", signup);
router.put("/account-activation/:activationToken", accountActivation);
router.post("/signin", signin);
router.put("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);

// Google
router.post("/google-login", googleLogin);
module.exports = router;
