const { checkSchema } = require('express-validator');
const { asyncHandler } = require('../../handlers/error');
const { extractRequiredFields } = require('../../handlers');
const { messagesPayload } = require('./createMessage');
const Messages = require('../../db/models/Messages');


const editMessagePayload = messagesPayload(true);
const editMessageValidationSchema = checkSchema(editMessagePayload, ['body']);


const editMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const messageData = extractRequiredFields(['message'], req.body);
  const message = await Messages.findByIdAndUpdate(id, messageData);
  if (!message) {
    return res.status(404).json({ message: req.t('NOT_FOUND', { field: 'Message' }) });
  }

  res.status(200).json(message);
});

module.exports = { editMessageValidationSchema, editMessage };

