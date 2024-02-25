const express = require('express');
const { sendMessagesUsers } = require('../../controllers/messages/sendMessagesUsers');
const { sendMessages } = require('../../controllers/messages/sendMessages');
const { createMessage } = require('../../controllers/messages/createMessage');
const { editMessage } = require('../../controllers/messages/editMessage');
const { deleteMessage } = require('../../controllers/messages/deleteMessage');
const router = express.Router();


router.get('/', sendMessages);
router.get('/users', sendMessagesUsers);
router.post('/', createMessage);
router.put('/', editMessage);
router.delete('/', deleteMessage);


module.exports = router;
