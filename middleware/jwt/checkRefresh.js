const createHttpError = require('http-errors');
const { logger } = require('../../logger');
const jwt = require('jsonwebtoken');
const { asyncHandler } = require('../../handlers/error');
const { RSAPUBLIC } = require('../../config');
const UsersToken = require('../../db/models/UsersTokens');


const checkRefresh = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.cookies.refresh;
    // remove Bearer\s
    const refresh = authHeader && authHeader?.split(' ')[1]?.replace(/,.+/g, '');
    if (!refresh) return next(createHttpError(403));

    if (refresh) {
      // check if the refresh token is exist
      const userToken = await UsersToken.findOne({ refresh });
      if (!userToken) return next(createHttpError(403));

      // check if the refresh token is valid
      jwt.verify(refresh, RSAPUBLIC, async (err, data) => {
        if (err) return next(createHttpError(403));

        req.payload = data;
        req.refresh = refresh;
        req.documentId = userToken._id;
        next();
      });
    } else {
      next(createHttpError(403));
    }
  } catch (err) {
    logger.error(err);
    res.status(400).json({ error: err.message });
  }
});


module.exports = checkRefresh;

/*

 // send the new token
        const user = await Users.findById(data._id);
        const payload = user.toJSON();
        const token = signToken(payload, TokensConfig.expairs);
        // update the token
        userToken.token = token;
        await userToken.save();

        res.status(200).json({ token });
*/
