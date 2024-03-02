
const jwt = require('jsonwebtoken');
const UsersTokens = require('../../db/models/UsersTokens');
const createHttpError = require('http-errors');
const { RSAPUBLIC, NODE_ENV, devEnvs } = require('../../config');
const { asyncHandler } = require('../../handlers/error');
const { parseJwt, validateMongoId } = require('../../handlers');

const checkAuth = asyncHandler(async (req, res, next) => {
  if (NODE_ENV === 'development') {
    // return next();
    // find any logged in user and use him as developer user
    const devUser = await UsersTokens.findOne(
      (req.body.userId && validateMongoId(req.body.userId))
        ? { userId: req.body.userId }
        : {},
      {},
      { sort: { createdAt: -1 } },
    );

    if (!devUser) throw new Error(req.t('USER_NOT_EXISTS'));

    req.payload = parseJwt(devUser.token);
    return next();
  }

  const authHeader = req.headers.authorization;

  if (devEnvs.includes(NODE_ENV) && req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

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

