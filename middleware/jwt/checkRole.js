const checkRole = roles => async (req, res, next) => {
  roles = typeof roles === 'string' ? [roles] : roles;
  const { role } = res.locals.payload;
  if (!roles.includes(role)) {
    return res.status(403).json({
      message: req.t('NOT_ALLOWED'),
    });
  }

  next();
};

module.exports = checkRole;
