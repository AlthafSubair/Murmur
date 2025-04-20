import { body } from 'express-validator';

export const registerValidationRules = [
  body('username')
    .isString()
    .isLength({ min: 3 })
    .trim()
    .escape()
    .withMessage('Username must be at least 3 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export const loginValidationRules = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export const otpResendValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
];

export const otpValidationRules = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email address is missing or invalid'),
  body('otp')
    .isNumeric()
    .isLength({ min: 6, max: 6 })
    .withMessage('Please enter a valid 6-digit OTP'),
];



export const resetPasswordValidationRules = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Confirm password must match password');
      }
      return true;
    })
];
