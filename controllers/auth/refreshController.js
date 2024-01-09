
const Users = require('../../db/models/Users');
const { asyncHandler } = require('../../handlers/error');
const UsersTokens = require('../../db/models/UsersTokens');
const { signToken } = require('../../middleware/jwt/tokens');
const { TokensConfig } = require('../../config');
const createHttpError = require('http-errors');

const refreshController = asyncHandler(async (req, res, next) => {
  // send the new token
  const user = await Users.findById(req.payload._id);
  const payload = user.toJSON();
  const token = signToken(payload, TokensConfig.expairs);

  // update the token
  const userToken = await UsersTokens.findByIdAndUpdate(req.documentId, {
    token,
  });

  if (userToken) {
    return res.status(200).json({ token });
  }

  next(createHttpError(403));
});


module.exports = refreshController;

