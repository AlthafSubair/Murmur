// validations/validateBody.js
import { validationResult } from "express-validator";

const validateBody = (validators) => {
  return async (req, res, next) => {
    // Run all validators
    await Promise.all(validators.map((validator) => validator.run(req)));

    // Handle errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array(),
      });
    }

    next();
  };
};

export default validateBody;
