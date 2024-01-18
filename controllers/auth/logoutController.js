const UsersToken = require('../../db/models/UsersTokens');
const createHttpError = require('http-errors');
const { logger } = require('../../logger');

const logoutController = async (req, res, next) => {
  try {
    let { refresh } = req.cookies;
    refresh = refresh && refresh?.split(' ')[1];
    if (refresh) {
      // check if the refresh token is exist
      const token = await UsersToken.findOne({ refresh });
      if (!token) return next(createHttpError(403));

      res.clearCookie('refresh');

      // remove the refresh token
      await UsersToken.deleteOne({ refresh });

      res.status(200).json({ message: req.t('LOGOUT') });
    } else {
      next(createHttpError(403));
    }
  } catch (err) {
    logger.error(err);
    err.status = 400;
    next(err);
  }
};

module.exports = logoutController;
