const express = require('express');
const { sendMessagesUsers } = require('../../controllers/messages/sendMessagesUsers');
const { sendMessages, sendMessageValidationSchema } = require('../../controllers/messages/sendMessages');
const { createMessage, createMessageValidationSchema } = require('../../controllers/messages/createMessage');
const { editMessage, editMessageValidationSchema } = require('../../controllers/messages/editMessage');
const { deleteMessage } = require('../../controllers/messages/deleteMessage');
const sendExpressValidatorErrors = require('../../middleware/sendExpressValidatorErrors');
const { validateParamId } = require('../../middleware/validators/validateParams');
const router = express.Router();


router.get(
  '/',
  sendMessageValidationSchema,
  sendExpressValidatorErrors,
  sendMessages,
);

router.get(
  '/users',
  sendMessagesUsers,
);

router.post(
  '/',
  createMessageValidationSchema,
  sendExpressValidatorErrors,
  createMessage,
);

router.put(
  '/:id',
  editMessageValidationSchema,
  validateParamId,
  sendExpressValidatorErrors,
  editMessage,
);

router.delete(
  '/:id',
  validateParamId,
  sendExpressValidatorErrors,
  deleteMessage,
);


module.exports = router;
