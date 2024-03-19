const { checkSchema } = require('express-validator');
const Users = require('../../db/models/Users');
const { logger } = require('../../logger');
const { hashPassword } = require('../../handlers/encryption');

const changePasswordCheckSchema = checkSchema({
  userId: {
    isMongoId: true,
    errorMessage: (value, { req }) => req.t('INVALID_ID'),
  },
  oldPassword: {
    notEmpty: true,
    errorMessage: (value, { req }) => req.t('MISSING_FIELD', { field: 'oldPassword' }),
  },
  newPassword: {
    notEmpty: true,
    isLength: {
      options: {
        min: 8,
      },
      errorMessage: (value, { req }) => req.t('MIN_LENGTH', {
        field: 'password',
        length: 8,
      }),
    },
  },
});

const changePasswordController = async function (req, res) {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    // check if user exists or throw error
    await Users.findByCredentials({ id: userId, password: oldPassword });
    // await Users.findOne({ _id: userId });

    // save the access token for expartion handling
    const pass = await hashPassword(newPassword);

    // update user password
    await Users.findByIdAndUpdate(userId, { password: pass });

    res.status(200).json({ success: true });
  } catch (err) {
    logger.error(err);
    res.status(400).json({ error: { message: err.message } });
  }
};

module.exports = { changePasswordController, changePasswordCheckSchema };

