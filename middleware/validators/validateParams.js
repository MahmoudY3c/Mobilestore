const { checkSchema } = require('express-validator');

const validateParamId = checkSchema({
  id: {
    isMongoId: true,
    errorMessage: (value, { req }) => req.t('INVALID_ID', { id: value }),
  },
}, ['params']);

module.exports = { validateParamId };

