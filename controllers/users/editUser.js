const { checkSchema } = require('express-validator');
const { usersPayload } = require('./createUser');
const { asyncHandler } = require('../../handlers/error');
const { extractRequiredFields } = require('../../handlers');
const Users = require('../../db/models/Users');

const editUserPayload = usersPayload(true);

const editUserValidationSchema = checkSchema(editUserPayload, ['body']);

const editUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userData = extractRequiredFields(Object.keys(editUserPayload), req.body);
  const user = await Users.findByIdAndUpdate(id, userData);
  if (!user) {
    return res.status(404).json({ message: req.t('NOT_FOUND', { field: 'user' }) });
  }

  res.status(200).json({ success: true });
});

module.exports = { editUserValidationSchema, editUser };

