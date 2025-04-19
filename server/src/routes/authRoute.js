import express from 'express';
import { checkAuth, logIn, logOut, registerEmail, resendOtp, resetPassword, updateProfile, verifyOtp } from '../controllers/authController.js';
import validateBody from '../middleware/validateBody.js';
import { loginValidationRules, otpResendValidation, otpValidationRules, registerValidationRules, resetPasswordValidationRules } from '../validation/authValidation.js';
import verifyToken  from '../middleware/verifyToken.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/register', validateBody(registerValidationRules), registerEmail)
router.post('/verify-otp', validateBody(otpValidationRules), verifyOtp)
router.post('/resend-otp', validateBody(otpResendValidation), resendOtp)
router.post('/reset-password', validateBody(resetPasswordValidationRules), resetPassword)
router.post('/login', validateBody(loginValidationRules), logIn)
router.post('/logout', logOut)
router.put('/update-profile', verifyToken, upload.single('profile') , updateProfile )
router.get('/check-auth', verifyToken, checkAuth)

export default router;