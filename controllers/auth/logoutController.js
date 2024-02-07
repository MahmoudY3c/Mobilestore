const UsersTokens = require('../../db/models/UsersTokens');
const createHttpError = require('http-errors');
const { asyncHandler } = require('../../handlers/error');

const logoutController = asyncHandler(async (req, res, next) => {
  let { refresh } = req.cookies;
  refresh = refresh && refresh?.split(' ')?.[1];

  if (refresh) {
    // check if the refresh token is exist
    const token = await UsersTokens.findOne({ refresh });
    if (!token) return next(createHttpError(403));

    // remove the refresh token
    await UsersTokens.deleteOne({ refresh });

    res.status(200).json({ message: req.t('LOGOUT') });
  } else {
    const authHeader = req.headers.authorization;
    // remove Bearer\s
    const token = authHeader && authHeader?.split(' ')?.[1];
    // remove the refresh token
    await UsersTokens.deleteOne({ token });

    res.status(200).json({ message: req.t('LOGOUT') });
  }
});

module.exports = logoutController;
