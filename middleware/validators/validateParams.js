const { checkSchema } = require('express-validator');

const validateParamId = checkSchema({
  id: {
    isMongoId: true,
  },
}, ['params']);

module.exports = { validateParamId };

