const { validationResult } = require('express-validator');

function sendExpressValidatorErrors(req, res, next) {
  //  validating the query
  const result = validationResult(req);
  if (result.isEmpty() === false) {
    console.log(result);
    const errors = result.array();

    return res.status(400).json({
      error: {
        errors,
        message: errors.map(e => e.msg).join('\n '),
      },
    });
  }

  next();
}

module.exports = sendExpressValidatorErrors;
