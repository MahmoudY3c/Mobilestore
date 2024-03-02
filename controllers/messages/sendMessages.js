const { checkSchema } = require('express-validator');
const Messages = require('../../db/models/Messages');
const { asyncHandler } = require('../../handlers/error');
const { ROLESNAMES } = require('../../config');

const sendMessageValidationSchema = checkSchema({
  user: {
    trim: true,
    isMongoId: true,
    errorMessage: (value, { req }) => req.t('INVALID_ID', { id: value }),
  },
}, ['query']);

const sendMessages = asyncHandler(async (req, res) => {
  const { skip = 0, limit = 14, user } = req.query;
  const { _id: sender, role } = req.payload;
  // that var is used to handle sending all receiver messages when the senderRole is admin
  const senderRole = role === ROLESNAMES.admin ? ROLESNAMES.admin : ROLESNAMES.customer;
  const query = { senderRole };
  // select by sender id when senderRole is customer else select by receiver id when sender role is admin
  if (role === ROLESNAMES.customer) {
    query.sender = sender;
  } else if (role === ROLESNAMES.admin) {
    query.receiver = user;
  }

  const msgs = await Messages.find(query, {}, { skip: Number(skip), limit: Number(limit) });

  // console.log(query, role, req.payload);

  const numberOfProducts = await Messages.countDocuments(query);
  res.status(200).json({ data: msgs, length: numberOfProducts });
});

module.exports = {
  sendMessages,
  sendMessageValidationSchema,
};

