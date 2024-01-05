const { checkSchema } = require('express-validator');
const { ROLES } = require('../../config');
const { asyncHandler } = require('../../handlers/error');
const Users = require('../../db/models/Users');
const { extractRequiredFields } = require('../../handlers');
const usersPayload = isOptional => ({
  userName: {
    trim: true,
    notEmpty: true,
    escape: true,
    optional: Boolean(isOptional),
  },
  phoneType: {
    trim: true,
    escape: true,
    optional: true,
  },
  password: {
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
    optional: Boolean(isOptional),
  },
  phoneNumber: {
    notEmpty: true,
    isMobilePhone: true,
    errorMessage: (value, { req }) => req.t('INVALID_PHONE_NUMBER', { value }),
    optional: Boolean(isOptional),
  },
  role: {
    notEmpty: true,
    optional: Boolean(isOptional),
    isIn: {
      options: [ROLES],
      errorMessage: (value, { req }) => req.t('INVALID_ROLE', { value }),
    },
  },
});

const createUserPayload = usersPayload(false);
const createUserValidationSchema = checkSchema(createUserPayload);

const createUser = asyncHandler(async (req, res) => {
  const userPayload = extractRequiredFields(Object.keys(createUserPayload), req.body);
  // check if user exists
  const checkPhoneNumber = await Users.findOne({ phoneNumber: userPayload.phoneNumber });
  if (checkPhoneNumber) {
    return res.status(400).json({ error: req.t('PHONE_NUMBER_EXISTS') });
  }

  const user = new Users(userPayload);
  await user.save();
  res.status(201).json(user);
});

module.exports = { createUser, createUserValidationSchema, usersPayload };
