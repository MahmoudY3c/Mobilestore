const { validationResult } = require('express-validator');

function sendExpressValidatorErrors(req, res, next) {
  //  validating the query
  const result = validationResult(req);
  if (result.isEmpty() === false) {
    return res.status(400).json({
      error: {
        errors: result.array(),
        message: result.array()[0].msg,
      },
    });
  }

  next();
}

module.exports = sendExpressValidatorErrors;
