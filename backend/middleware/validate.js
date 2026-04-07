const { validationResult } = require('express-validator');

/**
 * Middleware to check express-validator results.
 * If there are errors, responds with 400 and the first error message.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

module.exports = validate;
