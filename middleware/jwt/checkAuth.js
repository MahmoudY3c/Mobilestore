
const jwt = require('jsonwebtoken');
const UsersTokens = require('../../db/models/UsersTokens');
const createHttpError = require('http-errors');
const { RSAPUBLIC } = require('../../config');
const { asyncHandler } = require('../../handlers/error');

const checkAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // remove Bearer\s
  const token = authHeader && authHeader.split(' ')[1];
  if (token === null) return next(createHttpError(403));

  // check if the token available or user logged out
  const isExist = await UsersTokens.findOne({ token });
  // console.log(isExist)
  if (!isExist) return next(createHttpError(403));

  // deccrypt by RSAPUBLIC key and verify the auth expairation
  jwt.verify(token, RSAPUBLIC, async (err, data) => {
    if (err) {
      req.payload = isExist;
      // disallow user access
      return next(createHttpError(401));
    }

    req.payload = data;
    next();
  });
});

module.exports = {
  checkAuth,
};

