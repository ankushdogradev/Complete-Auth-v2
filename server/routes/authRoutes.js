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
  facebookLogin,
} = require("../controllers/authController");

router.post("/signup", signup);
router.put("/account-activation/:activationToken", accountActivation);
router.post("/signin", signin);
router.put("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);

// Google
router.post("/google-login", googleLogin);

// Facebook
router.post("/facebook-login", facebookLogin);

module.exports = router;
