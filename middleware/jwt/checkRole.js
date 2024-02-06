const { NODE_ENV } = require('../../config');

const checkRole = roles => async (req, res, next) => {
  if (NODE_ENV === 'development') {
    return next();
  }

  roles = typeof roles === 'string' ? [roles] : roles;
  const { role } = req.payload;
  if (!roles.includes(role)) {
    return res.status(403).json({
      message: req.t('NOT_ALLOWED'),
    });
  }

  next();
};

module.exports = checkRole;
