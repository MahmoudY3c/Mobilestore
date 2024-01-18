const ResetToken = require('../../db/models/ResetToken');
const { verifyHashToken } = require('../../handlers/encryption');
const { logger } = require('../../logger');
const createHttpError = require('http-errors');


const validateResetPassword = async function (req, res, next) {
  try {
    const { hash } = req.params;
    // check if the hash isn't expaired and delete it
    const verifyHash = await ResetToken.findOne({ hash });
    if (!verifyHash) return res.status(410).json({ error: 'invalid token' });
    // get the user data
    await verifyHash.populate('userId');

    const { email } = verifyHash.userId;
    const isValid = verifyHashToken(hash, email);

    if (isValid) {
      // remove the token
      await ResetToken.deleteOne({ hash });
      res.status(200).json({ allowed: true });
      return next();
    }

    return next(createHttpError(403));
  } catch (err) {
    logger.error(err);
  }
};

module.exports = validateResetPassword;

