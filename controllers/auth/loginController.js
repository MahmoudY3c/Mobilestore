const { checkSchema } = require('express-validator');
const { asyncHandler } = require('../../handlers/error');
const { extractRequiredFields } = require('../../handlers');
const { TokensConfig } = require('../../config');
const { signToken, updateToken } = require('../../middleware/jwt/tokens');
const Users = require('../../db/models/Users');

const loginPayload = isOptional => ({
  phoneNumber: {
    trim: true,
    isMobilePhone: true,
    optional: isOptional,
    errorMessage: (value, { req }) => req.t('INVALID_VALUE', { value }),
  },
  password: {
    trim: true,
    notEmpty: true,
    optional: isOptional,
    errorMessage: (value, { req }) => req.t('INVALID_VALUE', { value }),
  },
});

const _loginPayload = loginPayload(false);
const loginValidationSchema = checkSchema(_loginPayload);

const loginController = asyncHandler(async (req, res) => {
  const { phoneNumber, password } = extractRequiredFields(Object.keys(_loginPayload), req.body);
  const user = await Users.findByCredentials({ phoneNumber, password, req });
  const payload = user.toJSON();
  // make the refresh time similar to the collection item exapirs time
  const refresh = signToken(payload, TokensConfig.refresh);

  // some new special options for extensions tokens
  const token = signToken(payload, TokensConfig.expairs);

  await updateToken(user, token, refresh);

  res.cookie('refresh', refresh, {
    httpOnly: true,
    maxAge: TokensConfig.refreshMs,
    secure: true,
    sameSite: 'None',
  })
    .status(200)
    .json({
      token,
      user: payload,
    });
});

module.exports = {
  loginController,
  loginValidationSchema,
};

