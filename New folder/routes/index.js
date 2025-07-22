const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const signup = require('../controller/sign_up_controller');
const signin = require('../controller/sign_in_controller');

// for signup
router.post('/send_otp', signup.sendOtp);
router.post('/resend_otp', signup.resendOtp);
router.post('/verify_otp', signup.verifyOtp);
router.post('/sign_up', upload.single('file'), signup.CompleteSignup);

// for signin
router.post('/sign_in', signin.signIn);

// for resetpassword
router.post('/resetpasswordotp', signin.SendPasswordResetOtp);
router.post('/verifyresetotp', signin.verifyResetOtp);
router.post('/newpassword', signin.resetPassword);



module.exports = router;
