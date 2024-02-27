const { checkSchema } = require('express-validator');
const { asyncHandler, ErrorMessages } = require('../../handlers/error');
const { extractRequiredFields } = require('../../handlers');
const Messages = require('../../db/models/Messages');

const editMessagePayload = {
  message: {
    trim: true,
    isString: true,
    escape: true,
    errorMessage: (value, { req }) => req.t('INVALID_VALUE', { value }),
    isLength: {
      options: {
        min: 1,
      },
      errorMessage: (value, { req }) => req.t('MIN_LENGTH', {
        field: 'message',
        length: 1,
      }),
    },
  },
};

const editMessageValidationSchema = checkSchema(editMessagePayload, ['body']);

const editMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const messageData = extractRequiredFields(Object.keys(editMessagePayload), req.body);
  const message = await Messages.findByIdAndUpdate(id, messageData, { new: true });
  if (!message) {
    return res.status(404).json(ErrorMessages.NOT_FOUND(req, 'Message'));
  }

  res.status(200).json(message);
});

module.exports = { editMessageValidationSchema, editMessage };

