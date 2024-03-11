const { checkSchema } = require('express-validator');
const { asyncHandler } = require('../../handlers/error');
const { extractRequiredFields } = require('../../handlers');
const Messages = require('../../db/models/Messages');

const messagesPayload = isOptional => ({
  receiver: {
    optional: true, // Boolean(isOptional),
    trim: true,
    isMongoId: true,
    errorMessage: (value, { req }) => req.t('INVALID_ID', { id: value }),
  },
  message: {
    optional: Boolean(isOptional),
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
});

const createMessagePayload = messagesPayload(false);
const createMessageValidationSchema = checkSchema(createMessagePayload);

const createMessage = asyncHandler(async (req, res) => {
  const messagePayload = extractRequiredFields(Object.keys(createMessagePayload), req.body);
  const sender = req.payload._id;
  const senderRole = req.payload.role;
  const message = new Messages({ ...messagePayload, sender, senderRole });
  await message.save();
  res.status(201).json(message);
});

module.exports = { createMessage, createMessageValidationSchema, messagesPayload };
